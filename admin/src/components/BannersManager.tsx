"use client";

import { useEffect, useState } from "react";
import { api, assetUrl } from "@/lib/api";
import { Toast } from "./Toast";
import ImageUpload from "./ImageUpload";

interface Banner {
  id: string;
  location: string;
  title?: string | null;
  subtitle?: string | null;
  imagePath?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  order: number;
  isActive: boolean;
}

const empty: Partial<Banner> = {
  location: "",
  title: "",
  subtitle: "",
  imagePath: "",
  ctaLabel: "",
  ctaHref: "",
  order: 0,
  isActive: true,
};

function BannerForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: Partial<Banner>;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const [form, setForm] = useState<Partial<Banner>>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const editing = Boolean(initial.id);
  const set = (k: keyof Banner, v: unknown) => setForm((c) => ({ ...c, [k]: v }));

  const save = async () => {
    if (!form.location?.trim()) {
      setError("Location is required (e.g. home-hero).");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      location: form.location,
      title: form.title || undefined,
      subtitle: form.subtitle || undefined,
      imagePath: form.imagePath || undefined,
      ctaLabel: form.ctaLabel || undefined,
      ctaHref: form.ctaHref || undefined,
      order: Number(form.order) || 0,
      isActive: form.isActive ?? true,
    };
    try {
      if (editing) {
        await api(`/api/admin/banners/${initial.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await api(`/api/admin/banners`, { method: "POST", body: JSON.stringify(payload) });
      }
      onSaved(editing ? "Banner updated" : "Banner created");
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
          <h3>{editing ? "Edit banner" : "New banner"}</h3>
          <button className="close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="form-grid">
          <div className="field" style={{ margin: 0 }}>
            <label>Image</label>
            <ImageUpload value={form.imagePath ?? ""} onChange={(p) => set("imagePath", p)} />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="b-loc">Location *</label>
            <input id="b-loc" value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} placeholder="home-hero, pool-hero, …" />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="b-title">Title</label>
            <input id="b-title" value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="b-sub">Subtitle</label>
            <input id="b-sub" value={form.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="b-cl">Button label</label>
              <input id="b-cl" value={form.ctaLabel ?? ""} onChange={(e) => set("ctaLabel", e.target.value)} placeholder="Book now" />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="b-ch">Button link</label>
              <input id="b-ch" value={form.ctaHref ?? ""} onChange={(e) => set("ctaHref", e.target.value)} placeholder="/pool-booking" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, alignItems: "center" }}>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="b-ord">Order</label>
              <input id="b-ord" type="number" value={String(form.order ?? 0)} onChange={(e) => set("order", e.target.value)} />
            </div>
            <label className="check-row" style={{ marginTop: 18 }}>
              <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => set("isActive", e.target.checked)} />
              Active (shown on the site)
            </label>
          </div>
        </div>
        {error && <div className="field-error">{error}</div>}
        <div className="panel-actions">
          <button className="btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn-solid" onClick={save} disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Create banner"}</button>
        </div>
      </div>
    </div>
  );
}

export default function BannersManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [editorFor, setEditorFor] = useState<Partial<Banner> | null>(null);

  const load = () => {
    setLoading(true);
    api<Banner[]>("/api/admin/banners?limit=100&sortBy=order&sortDir=asc")
      .then((res) => setBanners(res.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load banners"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await api(`/api/admin/banners/${id}`, { method: "DELETE" });
      setToast("Banner deleted");
      load();
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h2>Banners</h2>
        <button className="btn-solid" onClick={() => setEditorFor(empty)}>+ New banner</button>
      </div>

      {loading ? (
        <div className="center-load"><div className="spinner" /></div>
      ) : error ? (
        <div className="empty">{error}</div>
      ) : banners.length === 0 ? (
        <div className="card empty">No banners yet. Add one to manage homepage / page hero imagery.</div>
      ) : (
        <div className="cms-list">
          {banners.map((b) => (
            <div className="cms-row" key={b.id}>
              {b.imagePath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="cms-thumb" src={assetUrl(b.imagePath)} alt={b.title ?? b.location} />
              ) : (
                <div className="cms-thumb empty">🖼</div>
              )}
              <div className="grow">
                <div className="r-title">{b.title || <span style={{ color: "var(--muted)" }}>Untitled</span>}</div>
                <div className="sub-txt">
                  <span className="chip brand plain" style={{ fontSize: 11 }}>{b.location}</span>
                  {b.ctaLabel ? ` · ${b.ctaLabel} → ${b.ctaHref || ""}` : ""}
                </div>
              </div>
              {!b.isActive && <span className="inactive-tag">Hidden</span>}
              <div className="row-act">
                <button className="mini" title="Edit" onClick={() => setEditorFor(b)}>✎</button>
                <button className="mini danger" title="Delete" onClick={() => remove(b.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editorFor && (
        <BannerForm
          initial={editorFor}
          onClose={() => setEditorFor(null)}
          onSaved={(m) => { setToast(m); load(); }}
        />
      )}
      <Toast message={toast} onDone={() => setToast("")} />
    </>
  );
}
