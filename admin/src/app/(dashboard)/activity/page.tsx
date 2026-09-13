"use client";

import { useCallback, useEffect, useState } from "react";
import { api, qs, type PageMeta } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Tab = "logins" | "audit";

interface AdminRef {
  id: string;
  name: string;
  email: string;
}

interface LoginEvent {
  id: string;
  email: string;
  success: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  admin: AdminRef | null;
}

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
  admin: AdminRef | null;
}

function fmt(dt: string) {
  return new Date(dt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Compress a user-agent to a short "Browser · OS" hint. */
function shortUa(ua: string | null): string {
  if (!ua) return "—";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /iPhone|iPad|iOS/.test(ua)
    ? "iOS"
    : /Mac OS X|Macintosh/.test(ua)
    ? "macOS"
    : /Android/.test(ua)
    ? "Android"
    : /Linux/.test(ua)
    ? "Linux"
    : "";
  const br = /Edg\//.test(ua)
    ? "Edge"
    : /Chrome\//.test(ua)
    ? "Chrome"
    : /Firefox\//.test(ua)
    ? "Firefox"
    : /Safari\//.test(ua)
    ? "Safari"
    : "Browser";
  return [br, os].filter(Boolean).join(" · ");
}

const actionChip: Record<string, string> = {
  create: "good",
  update: "info",
  status: "info",
  "reset-password": "warn",
  delete: "bad",
};

export default function ActivityPage() {
  const { admin: me } = useAuth();
  const [tab, setTab] = useState<Tab>("logins");
  const [page, setPage] = useState(1);
  const [logins, setLogins] = useState<LoginEvent[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    const path =
      tab === "logins"
        ? `/api/admin/admins/login-events${qs({ page, limit: 25 })}`
        : `/api/admin/admins/audit-logs${qs({ page, limit: 25 })}`;
    if (tab === "logins") {
      api<LoginEvent[]>(path)
        .then((res) => {
          setLogins(res.data);
          setMeta(res.meta ?? null);
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
        .finally(() => setLoading(false));
    } else {
      api<AuditLog[]>(path)
        .then((res) => {
          setAudits(res.data);
          setMeta(res.meta ?? null);
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
        .finally(() => setLoading(false));
    }
  }, [tab, page]);

  useEffect(load, [load]);

  const switchTab = (t: Tab) => {
    setTab(t);
    setPage(1);
  };

  if (me && me.role !== "SUPER_ADMIN") {
    return <div className="empty">Only super admins can view activity logs.</div>;
  }

  const colCount = 5;

  return (
    <>
      <div className="toolbar">
        <div className="seg" style={{ display: "inline-flex", gap: 6 }}>
          <button
            className={tab === "logins" ? "btn-solid" : "btn-outline"}
            onClick={() => switchTab("logins")}
          >
            Login history
          </button>
          <button
            className={tab === "audit" ? "btn-solid" : "btn-outline"}
            onClick={() => switchTab("audit")}
          >
            Action audit
          </button>
        </div>
        <div style={{ marginLeft: "auto", color: "var(--muted)", fontSize: 13 }}>
          {meta ? `${meta.total} record${meta.total === 1 ? "" : "s"}` : ""}
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            {tab === "logins" ? (
              <tr>
                <th>When</th>
                <th>User</th>
                <th>Result</th>
                <th>IP address</th>
                <th>Device</th>
              </tr>
            ) : (
              <tr>
                <th>When</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
              </tr>
            )}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={colCount} className="empty">
                  <div className="spinner" style={{ margin: "0 auto" }} />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={colCount} className="empty">
                  {error}
                </td>
              </tr>
            ) : tab === "logins" ? (
              logins.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="empty">
                    No login events yet.
                  </td>
                </tr>
              ) : (
                logins.map((ev) => (
                  <tr key={ev.id}>
                    <td style={{ whiteSpace: "nowrap", color: "var(--muted)", fontSize: 13 }}>
                      {fmt(ev.createdAt)}
                    </td>
                    <td>
                      {ev.admin ? (
                        <>
                          <div style={{ fontWeight: 600 }}>{ev.admin.name}</div>
                          <div className="brand-sub">{ev.admin.email}</div>
                        </>
                      ) : (
                        <span style={{ color: "var(--muted)" }}>{ev.email}</span>
                      )}
                    </td>
                    <td>
                      <span className={`chip ${ev.success ? "good" : "bad"}`}>
                        {ev.success ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>
                      {ev.ipAddress ?? "—"}
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }} title={ev.userAgent ?? ""}>
                      {shortUa(ev.userAgent)}
                    </td>
                  </tr>
                ))
              )
            ) : audits.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="empty">
                  No actions logged yet.
                </td>
              </tr>
            ) : (
              audits.map((a) => (
                <tr key={a.id}>
                  <td style={{ whiteSpace: "nowrap", color: "var(--muted)", fontSize: 13 }}>
                    {fmt(a.createdAt)}
                  </td>
                  <td>
                    {a.admin ? (
                      <>
                        <div style={{ fontWeight: 600 }}>{a.admin.name}</div>
                        <div className="brand-sub">{a.admin.email}</div>
                      </>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className={`chip plain ${actionChip[a.action] ?? "info"}`}>{a.action}</span>
                  </td>
                  <td>{a.entity}</td>
                  <td style={{ color: "var(--muted)", fontSize: 12.5, maxWidth: 320 }}>
                    {a.meta && Object.keys(a.meta).length > 0 ? (
                      <code style={{ wordBreak: "break-word" }}>{JSON.stringify(a.meta)}</code>
                    ) : a.entityId ? (
                      <span style={{ fontFamily: "ui-monospace, monospace" }}>{a.entityId}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="pager">
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>
          <div className="pg">
            <button
              className="btn-outline"
              disabled={!meta.hasPrev || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹ Prev
            </button>
            <button
              className="btn-outline"
              disabled={!meta.hasNext || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
