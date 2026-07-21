"use client";

import { useEffect, useState } from "react";
import { api, assetUrl } from "@/lib/api";
import { Toast } from "./Toast";
import ImageUpload from "./ImageUpload";

interface GalleryImage {
  id: string;
  title?: string | null;
  imagePath: string;
  category?: string | null;
  order: number;
  isActive: boolean;
}

const empty: Partial<GalleryImage> = { title: "", imagePath: "", category: "", order: 0, isActive: true };

function GalleryForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: Partial<GalleryImage>;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const [form, setForm] = useState<Partial<GalleryImage>>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const editing = Boolean(initial.id);
  const set = (k: keyof GalleryImage, v: unknown) => setForm((c) => ({ ...c, [k]: v }));

  const save = async () => {
    if (!form.imagePath) {
      setError("Please upload an image first.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      imagePath: form.imagePath,
      title: form.title || undefined,
      category: form.category || undefined,
      order: Number(form.order) || 0,
      isActive: form.isActive ?? true,
    };
    try {
      if (editing) {
        await api(`/api/admin/gallery/${initial.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await api(`/api/admin/gallery`, { method: "POST", body: JSON.stringify(payload) });
      }
      onSaved(editing ? "Image updated" : "Image added");
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
          <h3>{editing ? "Edit image" : "Add gallery image"}</h3>
          <button className="close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="form-grid">
          <div className="field" style={{ margin: 0 }}>
            <label>Image *</label>
            <ImageUpload value={form.imagePath ?? ""} onChange={(p) => set("imagePath", p)} />
          </div>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="g-title">Title</label>
            <input id="g-title" value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 110px", gap: 12 }}>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="g-cat">Category</label>
              <input id="g-cat" value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} placeholder="Events, Interiors…" />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="g-ord">Order</label>
              <input id="g-ord" type="number" value={String(form.order ?? 0)} onChange={(e) => set("order", e.target.value)} />
            </div>
          </div>
          <label className="check-row">
            <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => set("isActive", e.target.checked)} />
            Active (shown on the site)
          </label>
        </div>
        {error && <div className="field-error">{error}</div>}
        <div className="panel-actions">
          <button className="btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn-solid" onClick={save} disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Add image"}</button>
        </div>
      </div>
    </div>
  );
}

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [editorFor, setEditorFor] = useState<Partial<GalleryImage> | null>(null);

  const load = () => {
    setLoading(true);
    api<GalleryImage[]>("/api/admin/gallery?limit=100&sortBy=order&sortDir=asc")
      .then((res) => setImages(res.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load gallery"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await api(`/api/admin/gallery/${id}`, { method: "DELETE" });
      setToast("Image deleted");
      load();
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h2>Gallery</h2>
        <button className="btn-solid" onClick={() => setEditorFor(empty)}>+ Add image</button>
      </div>

      {loading ? (
        <div className="center-load"><div className="spinner" /></div>
      ) : error ? (
        <div className="empty">{error}</div>
      ) : images.length === 0 ? (
        <div className="card empty">No images yet. Upload photos to build the gallery.</div>
      ) : (
        <div className="cms-grid">
          {images.map((g) => (
            <div className="cms-card" key={g.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ph" src={assetUrl(g.imagePath)} alt={g.title ?? "gallery image"} />
              <div className="body">
                <div className="r-title" style={{ fontSize: 13.5 }}>
                  {g.title || <span style={{ color: "var(--muted)" }}>Untitled</span>}
                </div>
                <div className="sub-txt">
                  {g.category || "—"} {!g.isActive && <span className="inactive-tag" style={{ marginLeft: 6 }}>Hidden</span>}
                </div>
                <div className="row-act">
                  <button className="mini" title="Edit" onClick={() => setEditorFor(g)}>✎</button>
                  <button className="mini danger" title="Delete" onClick={() => remove(g.id)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editorFor && (
        <GalleryForm
          initial={editorFor}
          onClose={() => setEditorFor(null)}
          onSaved={(m) => { setToast(m); load(); }}
        />
      )}
      <Toast message={toast} onDone={() => setToast("")} />
    </>
  );
}
