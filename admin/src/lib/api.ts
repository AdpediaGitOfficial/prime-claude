const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const ACCESS_KEY = "pp_admin_access";
const REFRESH_KEY = "pp_admin_refresh";

export const tokenStore = {
  get access() {
    return typeof window === "undefined" ? null : localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return typeof window === "undefined" ? null : localStorage.getItem(REFRESH_KEY);
  },
  set(access: string, refresh: string) {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PageMeta;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

async function rawFetch(path: string, options: RequestInit, withAuth: boolean) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (withAuth && tokenStore.access) {
    headers.Authorization = `Bearer ${tokenStore.access}`;
  }
  return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
}

async function tryRefresh(): Promise<boolean> {
  const refresh = tokenStore.refresh;
  if (!refresh) return false;
  try {
    const res = await rawFetch(
      "/api/admin/auth/refresh",
      { method: "POST", body: JSON.stringify({ refreshToken: refresh }) },
      false
    );
    if (!res.ok) return false;
    const json = (await res.json()) as ApiEnvelope<{ accessToken: string; refreshToken: string }>;
    tokenStore.set(json.data.accessToken, json.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

/**
 * Admin API call returning the parsed envelope. Adds the bearer token and,
 * on a 401, transparently refreshes once and retries.
 */
export async function api<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiEnvelope<T>> {
  let res = await rawFetch(path, options, true);

  if (res.status === 401 && tokenStore.refresh) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await rawFetch(path, options, true);
    } else {
      tokenStore.clear();
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new ApiError(401, "Session expired");
    }
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (json as { message?: string }).message || `Request failed (${res.status})`;
    throw new ApiError(res.status, msg);
  }
  return json as ApiEnvelope<T>;
}

/** Login is unauthenticated; stores tokens on success. */
export async function login(email: string, password: string) {
  const res = await rawFetch(
    "/api/admin/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    false
  );
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, (json as { message?: string }).message || "Login failed");
  }
  const data = (json as ApiEnvelope<{ accessToken: string; refreshToken: string; admin: unknown }>).data;
  tokenStore.set(data.accessToken, data.refreshToken);
  return data;
}

export async function logout() {
  const refresh = tokenStore.refresh;
  if (refresh) {
    await rawFetch(
      "/api/admin/auth/logout",
      { method: "POST", body: JSON.stringify({ refreshToken: refresh }) },
      false
    ).catch(() => undefined);
  }
  tokenStore.clear();
}

/** Absolute URL for a stored asset path (e.g. "/uploads/x.jpg"). */
export function assetUrl(path?: string | null): string {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Upload a single file (multipart). Returns the stored path + absolute url. */
export async function uploadFile(
  file: File
): Promise<{ url: string; path: string; filename: string }> {
  const form = new FormData();
  form.append("file", file);

  const doUpload = () => {
    const headers: Record<string, string> = {};
    if (tokenStore.access) headers.Authorization = `Bearer ${tokenStore.access}`;
    // Do NOT set Content-Type — the browser adds the multipart boundary.
    return fetch(`${API_BASE_URL}/api/admin/uploads`, { method: "POST", headers, body: form });
  };

  let res = await doUpload();
  if (res.status === 401 && (await tryRefresh())) res = await doUpload();

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, (json as { message?: string }).message || "Upload failed");
  }
  return (json as ApiEnvelope<{ url: string; path: string; filename: string }>).data;
}

/** Build a query string from a params object, skipping empty values. */
export function qs(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== null) sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
