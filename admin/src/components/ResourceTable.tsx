"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, qs, type PageMeta } from "@/lib/api";
import { statusClass, titleCase } from "@/lib/format";
import { Toast } from "./Toast";

export type RowRecord = Record<string, unknown>;

export interface Column {
  header: string;
  cell: (row: RowRecord) => React.ReactNode;
  align?: "right";
}

export interface ResourceConfig {
  key: string;
  label: string;
  path: string; // e.g. "/api/admin/pool-bookings"
  kind: "booking" | "lead";
  columns: Column[];
  searchPlaceholder?: string;
}

const STATUSES: Record<"booking" | "lead", string[]> = {
  booking: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
  lead: ["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"],
};

const LIMIT = 10;

export default function ResourceTable({ resources }: { resources: ResourceConfig[] }) {
  const [tab, setTab] = useState(resources[0]);
  const [rows, setRows] = useState<RowRecord[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = qs({ page, limit: LIMIT, search, status, sortBy: "createdAt", sortDir });
      const res = await api<RowRecord[]>(`${tab.path}${query}`);
      setRows(res.data);
      setMeta(res.meta ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab.path, page, search, status, sortDir]);

  useEffect(() => {
    void load();
  }, [load]);

  // Reset paging when switching tab / filters.
  const switchTab = (r: ResourceConfig) => {
    setTab(r);
    setPage(1);
    setStatus("");
    setSearch("");
  };

  const onSearch = (v: string) => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setSearch(v);
      setPage(1);
    }, 300);
  };

  const changeStatus = async (id: string, next: string) => {
    try {
      await api(`${tab.path}/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      setRows((cur) => cur.map((r) => (r.id === id ? { ...r, status: next } : r)));
      setToast(`Status updated to ${titleCase(next)}`);
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Update failed");
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this record permanently?")) return;
    try {
      await api(`${tab.path}/${id}`, { method: "DELETE" });
      setToast("Record deleted");
      void load();
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const colCount = tab.columns.length + 2; // + status + actions

  return (
    <>
      {resources.length > 1 && (
        <div className="tabs">
          {resources.map((r) => (
            <button
              key={r.key}
              className={`tab${tab.key === r.key ? " active" : ""}`}
              onClick={() => switchTab(r)}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      <div className="toolbar">
        <div className="search">
          <span className="mag">⌕</span>
          <input
            placeholder={tab.searchPlaceholder ?? "Search by name, phone or email…"}
            defaultValue=""
            key={tab.key}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <select
          className="filter"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          {STATUSES[tab.kind].map((s) => (
            <option key={s} value={s}>
              {titleCase(s)}
            </option>
          ))}
        </select>
        <select
          className="filter"
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {tab.columns.map((c) => (
                <th key={c.header} style={c.align === "right" ? { textAlign: "right" } : undefined}>
                  {c.header}
                </th>
              ))}
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={colCount} className="empty"><div className="spinner" style={{ margin: "0 auto" }} /></td></tr>
            ) : error ? (
              <tr><td colSpan={colCount} className="empty">{error}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={colCount} className="empty">No records match your filters.</td></tr>
            ) : (
              rows.map((row) => {
                const id = String(row.id);
                const st = String(row.status);
                return (
                  <tr key={id}>
                    {tab.columns.map((c) => (
                      <td key={c.header} style={c.align === "right" ? { textAlign: "right" } : undefined}>
                        {c.cell(row)}
                      </td>
                    ))}
                    <td>
                      <span className={`chip ${statusClass(st)}`} style={{ marginRight: 8 }}>
                        {titleCase(st)}
                      </span>
                    </td>
                    <td>
                      <div className="row-act" style={{ justifyContent: "flex-end" }}>
                        <select
                          className="status-select"
                          value={st}
                          onChange={(e) => changeStatus(id, e.target.value)}
                          title="Change status"
                        >
                          {STATUSES[tab.kind].map((s) => (
                            <option key={s} value={s}>{titleCase(s)}</option>
                          ))}
                        </select>
                        <button className="mini danger" title="Delete" onClick={() => remove(id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <span>
          {meta
            ? `Showing ${rows.length} of ${meta.total} ${tab.label.toLowerCase()} records`
            : ""}
        </span>
        <div className="pg">
          <button disabled={!meta?.hasPrev} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</button>
          <button className="on">{meta?.page ?? 1}</button>
          <button disabled={!meta?.hasNext} onClick={() => setPage((p) => p + 1)}>›</button>
        </div>
      </div>

      <Toast message={toast} onDone={() => setToast("")} />
    </>
  );
}
