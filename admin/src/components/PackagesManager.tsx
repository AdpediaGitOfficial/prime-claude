"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { inr } from "@/lib/format";
import { Toast } from "./Toast";

interface Listing {
  id: string;
  type: string;
  name: string;
  code?: string | null;
  description?: string | null;
  price?: number | null;
  durationLabel?: string | null;
  capacity?: number | null;
  isAvailable: boolean;
  isActive: boolean;
  order: number;
  metadata?: Record<string, unknown> | null;
}

export interface PackageTab {
  key: string;
  label: string;
  showPrice: boolean;
  showCapacity: boolean;
  /** Extra metadata list fields (stored as string[] under metadata[key]). */
  listFields: { key: string; label: string }[];
}

export const PACKAGE_CONFIGS: Record<string, PackageTab> = {
  POOL: {
    key: "POOL", label: "Pool packages", showPrice: true, showCapacity: true,
    listFields: [{ key: "features", label: "Features (one per line)" }],
  },
  SPA_SERVICE: {
    key: "SPA_SERVICE", label: "Spa services", showPrice: false, showCapacity: false,
    listFields: [],
  },
  COURSE: {
    key: "COURSE", label: "Courses", showPrice: false, showCapacity: false,
    listFields: [
      { key: "modules", label: "Modules / syllabus (one per line)" },
      { key: "eligibility", label: "Eligibility (one per line)" },
    ],
  },
};

type Tab = PackageTab;

function metaList(l: Partial<Listing> | undefined, key: string): string[] {
  const f = (l?.metadata as Record<string, unknown> | undefined)?.[key];
  return Array.isArray(f) ? (f as string[]) : [];
}

function PackageForm({
  tab,
  initial,
  onClose,
  onSaved,
}: {
  tab: Tab;
  initial: Partial<Listing>;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const editing = Boolean(initial.id);
  const [name, setName] = useState(initial.name ?? "");
  const [price, setPrice] = useState(initial.price != null ? String(initial.price) : "");
  const [durationLabel, setDurationLabel] = useState(initial.durationLabel ?? "");
  const [capacity, setCapacity] = useState(initial.capacity != null ? String(initial.capacity) : "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [lists, setLists] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const lf of tab.listFields) init[lf.key] = metaList(initial, lf.key).join("\n");
    return init;
  });
  const [order, setOrder] = useState(String(initial.order ?? 0));
  const [isActive, setIsActive] = useState(initial.isActive ?? true);
  const [isAvailable, setIsAvailable] = useState(initial.isAvailable ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    const metadata: Record<string, unknown> = { ...(initial.metadata ?? {}) };
    for (const lf of tab.listFields) {
      metadata[lf.key] = (lists[lf.key] ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
    }
    const payload: Record<string, unknown> = {
      type: tab.key,
      name: name.trim(),
      durationLabel: durationLabel || undefined,
      description: description || undefined,
      order: Number(order) || 0,
      isActive,
      isAvailable,
      metadata,
    };
    if (tab.showPrice && price !== "") payload.price = Number(price);
    if (tab.showCapacity && capacity !== "") payload.capacity = Number(capacity);

    try {
      if (editing) {
        await api(`/api/admin/listings/${initial.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await api(`/api/admin/listings`, { method: "POST", body: JSON.stringify(payload) });
      }
      onSaved(editing ? "Package updated" : "Package created");
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overlay center" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="panel-head">
          <h3>{editing ? `Edit ${tab.label.toLowerCase().replace(/s$/, "")}` : `New ${tab.label.toLowerCase().replace(/s$/, "")}`}</h3>
          <button className="close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="form-grid">
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="p-name">Name *</label>
            <input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {tab.showPrice && (
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="p-price">Price (₹)</label>
                <input id="p-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            )}
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="p-dur">Duration</label>
              <input id="p-dur" value={durationLabel} onChange={(e) => setDurationLabel(e.target.value)} placeholder="60 min / 100-120 hours" />
            </div>
            {tab.showCapacity && (
              <div className="field" style={{ margin: 0 }}>
                <label htmlFor="p-cap">Capacity</label>
                <input id="p-cap" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              </div>
            )}
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="p-desc">Description</label>
            <textarea id="p-desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {tab.listFields.map((lf) => (
            <div className="field" style={{ margin: 0 }} key={lf.key}>
              <label htmlFor={`p-${lf.key}`}>{lf.label}</label>
              <textarea
                id={`p-${lf.key}`}
                rows={4}
                value={lists[lf.key] ?? ""}
                onChange={(e) => setLists((c) => ({ ...c, [lf.key]: e.target.value }))}
              />
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr", gap: 12, alignItems: "center" }}>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="p-ord">Order</label>
              <input id="p-ord" type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
            </div>
            <label className="check-row" style={{ marginTop: 18 }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active
            </label>
            <label className="check-row" style={{ marginTop: 18 }}>
              <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
              Available
            </label>
          </div>
        </div>
        {error && <div className="field-error">{error}</div>}
        <div className="panel-actions">
          <button className="btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn-solid" onClick={save} disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Create"}</button>
        </div>
      </div>
    </div>
  );
}

export default function PackagesManager({ tabKeys }: { tabKeys: string[] }) {
  // Resolve config keys inside the client module (route pages pass plain
  // strings — server components can't safely import values from here).
  const tabs = tabKeys.map((k) => PACKAGE_CONFIGS[k]).filter(Boolean);
  const [tab, setTab] = useState<Tab>(tabs[0]);
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [editorFor, setEditorFor] = useState<Partial<Listing> | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    api<Listing[]>(`/api/admin/listings?type=${tab.key}`)
      .then((res) => setItems([...res.data].sort((a, b) => a.order - b.order)))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load packages"))
      .finally(() => setLoading(false));
  }, [tab.key]);
  useEffect(load, [load]);

  const remove = async (id: string) => {
    if (!window.confirm("Delete this package?")) return;
    try {
      await api(`/api/admin/listings/${id}`, { method: "DELETE" });
      setToast("Package deleted");
      load();
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <>
      {tabs.length > 1 && (
        <div className="tabs">
          {tabs.map((t) => (
            <button key={t.key} className={`tab${tab.key === t.key ? " active" : ""}`} onClick={() => setTab(t)}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="section-head" style={{ marginTop: 0 }}>
        <h2>{tab.label}</h2>
        <button className="btn-solid" onClick={() => setEditorFor({})}>+ New</button>
      </div>

      {loading ? (
        <div className="center-load"><div className="spinner" /></div>
      ) : error ? (
        <div className="empty">{error}</div>
      ) : items.length === 0 ? (
        <div className="card empty">No {tab.label.toLowerCase()} yet.</div>
      ) : (
        <div className="cms-list">
          {items.map((l) => (
            <div className="cms-row" key={l.id}>
              <div className="grow">
                <div className="r-title">
                  {l.name}
                  {tab.showPrice && l.price != null && (
                    <span className="tnum" style={{ color: "var(--brand-ink)", marginLeft: 10 }}>{inr(l.price)}</span>
                  )}
                </div>
                <div className="sub-txt">
                  {l.durationLabel ? `${l.durationLabel}` : ""}
                  {tab.showCapacity && l.capacity != null ? ` · up to ${l.capacity}` : ""}
                  {tab.listFields.map((lf) =>
                    metaList(l, lf.key).length ? ` · ${metaList(l, lf.key).length} ${lf.key}` : ""
                  ).join("")}
                </div>
              </div>
              {!l.isActive && <span className="inactive-tag">Hidden</span>}
              <div className="row-act">
                <button className="mini" title="Edit" onClick={() => setEditorFor(l)}>✎</button>
                <button className="mini danger" title="Delete" onClick={() => remove(l.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editorFor && (
        <PackageForm
          tab={tab}
          initial={editorFor}
          onClose={() => setEditorFor(null)}
          onSaved={(m) => { setToast(m); load(); }}
        />
      )}
      <Toast message={toast} onDone={() => setToast("")} />
    </>
  );
}
