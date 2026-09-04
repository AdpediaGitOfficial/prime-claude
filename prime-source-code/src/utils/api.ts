const ENV_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Resolve the API base URL at call time. An explicit NEXT_PUBLIC_API_BASE_URL
 * always wins. If it wasn't set at build time, fall back to same-origin
 * `/backend` when we're on a real domain (the deployment convention) — this
 * prevents a build that forgot the env var from calling http://localhost:5000
 * (which fails with a loopback/CORS error in production). Local dev keeps
 * localhost:5000.
 */
const apiBase = (): string => {
  if (ENV_API_BASE) return ENV_API_BASE;
  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    if (h !== "localhost" && h !== "127.0.0.1") return `${window.location.origin}/backend`;
  }
  return "http://localhost:5000";
};

export const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${apiBase()}${endpoint}`;
  const { headers: extraHeaders, ...rest } = options;

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(extraHeaders ? (extraHeaders as Record<string, string>) : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const msg =
      (errorData as any).error ||
      (errorData as any).message ||
      (errorData as any).detail ||
      `Server error ${response.status}`;
    console.error("[API]", response.status, endpoint, errorData);
    throw new Error(msg);
  }

  return response.json();
};

/** Absolute URL for a stored asset path (e.g. "/uploads/x.jpg" from the API). */
export const assetUrl = (path?: string | null): string => {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return `${apiBase()}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const ENDPOINTS = {
  SEND_OTP: "/api/auth/send-otp",
  CREATE_BOOKING: "/api/bookings/create-verified",
  POOL_BOOKINGS: "/pool-bookings",
  HALL_BOOKINGS: "/hall-bookings",
  SPA_BOOKINGS: "/spa-bookings",
  GYM_MEMBERSHIPS: "/gym-memberships",
  VENDOR_INVITES: "/vendor-invites",
  COURSE_REGISTRATIONS: "/course-registrations",
  CONTACT_ENQUIRIES: "/contact-enquiries",
  LISTINGS: "/listings",
  SITE_SETTINGS: "/site-settings",
  BANNERS: "/banners",
  GALLERY: "/gallery",
} as const;
