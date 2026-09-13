"use client";

import { useEffect, useState } from "react";
import { api, assetUrl, ApiError } from "@/lib/api";
import { Toast } from "./Toast";
import ImageUpload from "./ImageUpload";

interface Banner {
  id: string;
  location: string;
  title?: string | null;
  imagePath?: string | null;
  ctaHref?: string | null;
  order: number;
  isActive: boolean;
}

interface PopupConfig {
  enabled: boolean;
  autoplay: number;
  frequency: "session" | "always" | "daily";
  scope: "home" | "all";
}

const DEFAULT_CONFIG: PopupConfig = {
  enabled: false,
  autoplay: 5,
  frequency: "session",
  scope: "home",
};

const LOCATION = "popup";

function Switch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      aria-label="Enable pop-up"
      style={{
        position: "relative",
        width: 52,
        height: 30,
        borderRadius: 999,
        border: "none",
        flex: "none",
        cursor: "pointer",
        background: on ? "var(--good)" : "var(--line)",
        transition: "background .15s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 25 : 3,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,.3)",
          transition: "left .15s",
        }}
      />
    </button>
  );
}

/** Inline "add slide" card: upload an image, it becomes a new popup banner. */
function AddSlide({ nextOrder, onAdded }: { nextOrder: number; onAdded: (m: string) => void }) {
  const [busy, setBusy] = useState(false);

  const create = async (imagePath: string) => {
    if (!imagePath) return;
    setBusy(true);
    try {
      await api("/api/admin/banners", {
        method: "POST",
        body: JSON.stringify({ location: LOCATION, imagePath, order: nextOrder, isActive: true }),
      });
      onAdded("Slide added");
    } catch (e) {
      onAdded(e instanceof Error ? e.message : "Failed to add slide");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{ padding: 14, borderStyle: "dashed" }}>
      <div className="field" style={{ margin: 0 }}>
        <label style={{ fontSize: 12.5, color: "var(--muted)" }}>
          {busy ? "Adding slide…" : "Add slide — upload a poster image"}
        </label>
        <ImageUpload value="" onChange={create} />
      </div>
    </div>
  );
}

export default function PopupManager() {
  const [config, setConfig] = useState<PopupConfig>(DEFAULT_CONFIG);
  const [slides, setSlides] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [savingCfg, setSavingCfg] = useState(false);
  // Local, unsaved link edits keyed by banner id.
  const [links, setLinks] = useState<Record<string, string>>({});

  const load = () => {
    setLoading(true);
    Promise.all([
      api<Banner[]>(`/api/admin/banners?limit=100&sortBy=order&sortDir=asc&search=${LOCATION}`)
        .then((res) => res.data.filter((b) => b.location === LOCATION))
        .catch(() => [] as Banner[]),
      api<{ value: PopupConfig }>(`/api/admin/settings/${LOCATION}`)
        .then((res) => ({ ...DEFAULT_CONFIG, ...(res.data.value as object) }))
        .catch((e) => {
          if (e instanceof ApiError && e.status === 404) return DEFAULT_CONFIG;
          throw e;
        }),
    ])
      .then(([banners, cfg]) => {
        setSlides(banners);
        setConfig(cfg);
        setLinks(Object.fromEntries(banners.map((b) => [b.id, b.ctaHref ?? ""])));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load pop-up"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const saveConfig = async (next: PopupConfig, note = "Pop-up settings saved") => {
    setSavingCfg(true);
    try {
      await api(`/api/admin/settings/${LOCATION}`, {
        method: "PUT",
        body: JSON.stringify({ value: next, group: "content" }),
      });
      setConfig(next);
      setToast(note);
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingCfg(false);
    }
  };

  const toggleEnabled = () => {
    const next = { ...config, enabled: !config.enabled };
    void saveConfig(next, next.enabled ? "Pop-up turned ON" : "Pop-up turned OFF");
  };

  const setField = <K extends keyof PopupConfig>(k: K, v: PopupConfig[K]) =>
    setConfig((c) => ({ ...c, [k]: v }));

  const saveLink = async (b: Banner) => {
    const href = (links[b.id] ?? "").trim();
    if (href === (b.ctaHref ?? "")) return;
    try {
      await api(`/api/admin/banners/${b.id}`, {
        method: "PUT",
        body: JSON.stringify({ ctaHref: href || undefined }),
      });
      setSlides((cur) => cur.map((s) => (s.id === b.id ? { ...s, ctaHref: href } : s)));
      setToast("Link updated");
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Save failed");
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= slides.length) return;
    const a = slides[index];
    const b = slides[target];
    // Swap their order values.
    try {
      await Promise.all([
        api(`/api/admin/banners/${a.id}`, { method: "PUT", body: JSON.stringify({ order: b.order }) }),
        api(`/api/admin/banners/${b.id}`, { method: "PUT", body: JSON.stringify({ order: a.order }) }),
      ]);
      load();
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Reorder failed");
    }
  };

  const toggleActive = async (b: Banner) => {
    try {
      await api(`/api/admin/banners/${b.id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !b.isActive }),
      });
      setSlides((cur) => cur.map((s) => (s.id === b.id ? { ...s, isActive: !s.isActive } : s)));
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Update failed");
    }
  };

  const remove = async (b: Banner) => {
    if (!window.confirm("Remove this slide from the pop-up?")) return;
    try {
      await api(`/api/admin/banners/${b.id}`, { method: "DELETE" });
      setToast("Slide removed");
      load();
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Delete failed");
    }
  };

  if (loading) return <div className="center-load"><div className="spinner" /></div>;
  if (error) return <div className="empty">{error}</div>;

  const activeCount = slides.filter((s) => s.isActive).length;

  return (
    <>
      {/* Master toggle */}
      <div
        className="card"
        style={{ padding: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>
            {config.enabled ? "Pop-up is ON" : "Pop-up is OFF"}
          </div>
          <div className="brand-sub" style={{ fontSize: 13 }}>
            {config.enabled
              ? `Visitors see ${activeCount || "no"} active slide${activeCount === 1 ? "" : "s"}`
              : "Hidden from visitors"}
          </div>
        </div>
        <Switch on={config.enabled} onChange={toggleEnabled} />
      </div>

      {/* Slides */}
      <div className="section-head" style={{ marginTop: 0 }}>
        <h2>Pop-up slides</h2>
        <span className="brand-sub">{slides.length} slide{slides.length === 1 ? "" : "s"}</span>
      </div>

      {slides.length === 0 ? (
        <div className="card empty" style={{ marginBottom: 14 }}>
          No slides yet. Upload one below — the pop-up shows your posters as an auto-sliding carousel.
        </div>
      ) : (
        <div className="cms-list" style={{ marginBottom: 14 }}>
          {slides.map((b, i) => (
            <div className="cms-row" key={b.id}>
              {b.imagePath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="cms-thumb" src={assetUrl(b.imagePath)} alt={b.title ?? "slide"} style={{ aspectRatio: "3/4", height: 66, width: "auto" }} />
              ) : (
                <div className="cms-thumb empty">🖼</div>
              )}
              <div className="grow">
                <div className="r-title">Slide {i + 1}</div>
                <div className="field" style={{ margin: "6px 0 0", maxWidth: 340 }}>
                  <input
                    value={links[b.id] ?? ""}
                    placeholder="Link (optional) — e.g. /pool-booking"
                    onChange={(e) => setLinks((c) => ({ ...c, [b.id]: e.target.value }))}
                    onBlur={() => saveLink(b)}
                    style={{ fontSize: 13, padding: "7px 10px" }}
                  />
                </div>
              </div>
              {!b.isActive && <span className="inactive-tag">Hidden</span>}
              <div className="row-act" style={{ display: "flex", gap: 4 }}>
                <button className="mini" title="Move up" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                <button className="mini" title="Move down" onClick={() => move(i, 1)} disabled={i === slides.length - 1}>↓</button>
                <button className="mini" title={b.isActive ? "Hide" : "Show"} onClick={() => toggleActive(b)}>
                  {b.isActive ? "🙈" : "👁"}
                </button>
                <button className="mini danger" title="Remove" onClick={() => remove(b)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddSlide nextOrder={slides.length} onAdded={(m) => { setToast(m); load(); }} />

      {/* Behaviour settings */}
      <div className="section-head">
        <h2>Behaviour</h2>
      </div>
      <div className="card" style={{ padding: 20, maxWidth: 520 }}>
        <div className="field">
          <label>Auto-slide</label>
          <select value={String(config.autoplay)} onChange={(e) => setField("autoplay", Number(e.target.value))}>
            <option value="4">Every 4 seconds</option>
            <option value="5">Every 5 seconds</option>
            <option value="6">Every 6 seconds</option>
            <option value="0">Off (manual only)</option>
          </select>
        </div>
        <div className="field">
          <label>Show frequency</label>
          <select value={config.frequency} onChange={(e) => setField("frequency", e.target.value as PopupConfig["frequency"])}>
            <option value="session">Once per visit (session)</option>
            <option value="daily">Once per day</option>
            <option value="always">Every page load</option>
          </select>
        </div>
        <div className="field" style={{ marginBottom: 4 }}>
          <label>Show on</label>
          <select value={config.scope} onChange={(e) => setField("scope", e.target.value as PopupConfig["scope"])}>
            <option value="home">Home page only</option>
            <option value="all">All pages</option>
          </select>
        </div>
        <button
          className="btn-solid"
          style={{ marginTop: 12 }}
          onClick={() => void saveConfig(config)}
          disabled={savingCfg}
        >
          {savingCfg ? "Saving…" : "Save behaviour"}
        </button>
      </div>

      <Toast message={toast} onDone={() => setToast("")} />
    </>
  );
}
