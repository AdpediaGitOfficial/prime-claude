"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { titleCase } from "@/lib/format";
import { Toast } from "@/components/Toast";
import BannersManager from "@/components/BannersManager";

interface Setting {
  id: string;
  key: string;
  value: unknown;
  group: string;
}

function SettingCard({ setting, onSaved }: { setting: Setting; onSaved: (m: string) => void }) {
  const flat =
    setting.value && typeof setting.value === "object" && !Array.isArray(setting.value)
      ? (setting.value as Record<string, string>)
      : null;
  const [fields, setFields] = useState<Record<string, string>>(flat ?? {});
  const [raw, setRaw] = useState(flat ? "" : JSON.stringify(setting.value, null, 2));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const value = flat ? fields : JSON.parse(raw);
      await api(`/api/admin/settings/${setting.key}`, {
        method: "PUT",
        body: JSON.stringify({ value }),
      });
      onSaved(`${titleCase(setting.key)} saved`);
    } catch (e) {
      onSaved(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700 }}>{titleCase(setting.key)}</h3>
        <span className="chip brand plain">{setting.group}</span>
      </div>
      {flat ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.entries(fields).map(([k, v]) => (
            <div className="field" key={k} style={{ margin: 0 }}>
              <label>{titleCase(k)}</label>
              <input
                value={v}
                onChange={(e) => setFields((cur) => ({ ...cur, [k]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      ) : (
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={6}
          style={{
            width: "100%", padding: 12, borderRadius: 11, border: "1px solid var(--line)",
            background: "var(--ground)", color: "var(--ink)", fontFamily: "monospace", fontSize: 13,
          }}
        />
      )}
      <button className="btn-primary" style={{ marginTop: 16, width: "auto", padding: "0 22px" }} onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

function SettingsSection() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    api<Setting[]>("/api/admin/settings")
      .then((res) => setSettings(res.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="center-load"><div className="spinner" /></div>;
  if (error) return <div className="empty">{error}</div>;

  return (
    <>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h2>Site settings</h2>
      </div>
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {settings.map((s) => (
          <SettingCard key={s.id} setting={s} onSaved={setToast} />
        ))}
      </div>
      <Toast message={toast} onDone={() => setToast("")} />
    </>
  );
}

const TABS = [
  { key: "settings", label: "Settings" },
  { key: "banners", label: "Banners" },
] as const;

export default function ContentPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("settings");

  return (
    <>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`tab${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "settings" && <SettingsSection />}
      {tab === "banners" && <BannersManager />}
    </>
  );
}
