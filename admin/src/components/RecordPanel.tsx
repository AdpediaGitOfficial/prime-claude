"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { dateTime, statusClass, titleCase } from "@/lib/format";
import { sanitizeName, sanitizePhone, isValidName, isValidPhone, NAME_ERROR, PHONE_ERROR } from "@/lib/validation";
import { KIND_STATUSES, type FieldDef, type ResourceConfig, type RowRecord } from "./ResourceTable";

/** Classify a field so the shared form can validate names & phones. */
function fieldKind(f: FieldDef): "name" | "phone" | null {
  if (f.type === "tel") return "phone";
  if (f.type === "text" && /^(fullName|guestName)$/.test(f.name)) return "name";
  return null;
}

/** Returns an error message if any name/phone field is invalid, else "". */
function validateForm(fields: FieldDef[], values: Record<string, string>): string {
  for (const f of fields) {
    const kind = fieldKind(f);
    if (!kind) continue;
    const v = (values[f.name] ?? "").trim();
    if (!v) {
      if (f.required) return `${f.label} is required.`;
      continue; // optional & blank (e.g. offline block guest name) → allowed
    }
    if (kind === "name" && !isValidName(v)) return `${f.label}: ${NAME_ERROR}`;
    if (kind === "phone" && !isValidPhone(v)) return `${f.label}: ${PHONE_ERROR}`;
  }
  return "";
}

/** Coerce a stored value into a form input string. */
function toInput(field: FieldDef, value: unknown): string {
  if (value === null || value === undefined) return "";
  if (field.list && Array.isArray(value)) return (value as string[]).join(", ");
  return String(value);
}

/** Build the API payload from raw form values, coercing per field type. */
function toPayload(fields: FieldDef[], values: Record<string, string>, status: string) {
  const out: Record<string, unknown> = { status };
  for (const f of fields) {
    const raw = values[f.name] ?? "";
    if (f.type === "number") {
      if (raw === "") continue;
      out[f.name] = Number(raw);
    } else if (f.type === "select") {
      if (raw === "") continue; // unselected optional dropdown → omit
      out[f.name] = raw;
    } else if (f.list) {
      out[f.name] = raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
    } else {
      out[f.name] = raw;
    }
  }
  return out;
}

function FormFields({
  fields,
  values,
  setValues,
  status,
  setStatus,
  statuses,
}: {
  fields: FieldDef[];
  values: Record<string, string>;
  setValues: (v: Record<string, string>) => void;
  status: string;
  setStatus: (s: string) => void;
  statuses: string[];
}) {
  const set = (name: string, v: string) => setValues({ ...values, [name]: v });
  return (
    <div className="form-grid">
      {fields.map((f) => {
        const kind = fieldKind(f);
        const onInput = (v: string) =>
          set(f.name, kind === "name" ? sanitizeName(v) : kind === "phone" ? sanitizePhone(v) : v);
        return (
        <div className="field" key={f.name} style={{ margin: 0 }}>
          <label htmlFor={f.name}>
            {f.label}
            {f.required ? " *" : ""}
          </label>
          {f.type === "textarea" ? (
            <textarea id={f.name} rows={3} value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} />
          ) : f.type === "select" ? (
            <select id={f.name} value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)}>
              <option value="">{f.placeholder ?? "Select…"}</option>
              {f.options?.map((o) => {
                const val = typeof o === "string" ? o : o.value;
                const lab = typeof o === "string" ? o : o.label;
                return <option key={val} value={val}>{lab}</option>;
              })}
            </select>
          ) : (
            <input
              id={f.name}
              type={f.type}
              value={values[f.name] ?? ""}
              onChange={(e) => onInput(e.target.value)}
              {...(kind === "phone" ? { inputMode: "numeric" as const, maxLength: 10 } : {})}
            />
          )}
        </div>
        );
      })}
      <div className="field" style={{ margin: 0 }}>
        <label htmlFor="__status">Status</label>
        <select id="__status" value={status} onChange={(e) => setStatus(e.target.value)}>
          {statuses.map((s) => (
            <option key={s} value={s}>{titleCase(s)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/** Detail drawer: read-only view with an inline edit mode. */
export function RecordDrawer({
  config,
  row,
  onClose,
  onSaved,
}: {
  config: ResourceConfig;
  row: RowRecord;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const statuses = KIND_STATUSES[config.kind];
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const f of config.fields) v[f.name] = toInput(f, row[f.name]);
    return v;
  });
  const [status, setStatus] = useState(String(row.status));

  const save = async () => {
    const invalid = validateForm(config.fields, values);
    if (invalid) { setError(invalid); return; }
    setSaving(true);
    setError("");
    try {
      const res = await api<RowRecord>(`${config.path}/${row.id}`, {
        method: "PUT",
        body: JSON.stringify(toPayload(config.fields, values, status)),
      });
      onSaved(`${config.label} updated`);
      onClose();
      void res;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="panel-head">
          <div>
            <h3>
              {config.label} detail
              {row.reference ? (
                <span className="tnum" style={{ marginLeft: 8, fontWeight: 650, color: "var(--brand)" }}>
                  {String(row.reference)}
                </span>
              ) : null}
            </h3>
            <div className="sub-txt" style={{ marginTop: 4 }}>
              Received {dateTime(String(row.createdAt))}
            </div>
          </div>
          <button className="close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {editing ? (
          <>
            <FormFields
              fields={config.fields}
              values={values}
              setValues={setValues}
              status={status}
              setStatus={setStatus}
              statuses={statuses}
            />
            {error && <div className="field-error">{error}</div>}
            <div className="panel-actions">
              <button className="btn-outline" onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
              <button className="btn-solid" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
            </div>
          </>
        ) : (
          <>
            <div className="kv-list">
              {config.fields.map((f) => (
                <div className="kv" key={f.name}>
                  <span className="k">{f.label}</span>
                  <span className="v">{toInput(f, row[f.name]) || "—"}</span>
                </div>
              ))}
              <div className="kv">
                <span className="k">Status</span>
                <span className="v">
                  <span className={`chip ${statusClass(String(row.status))}`}>{titleCase(String(row.status))}</span>
                </span>
              </div>
            </div>
            <div className="panel-actions">
              <button className="btn-outline" onClick={onClose}>Close</button>
              <button className="btn-solid" onClick={() => setEditing(true)}>Edit</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Create modal for walk-in / manual entry. */
export function CreateModal({
  config,
  onClose,
  onSaved,
}: {
  config: ResourceConfig;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const statuses = KIND_STATUSES[config.kind];
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState(statuses[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    const invalid = validateForm(config.fields, values);
    if (invalid) { setError(invalid); return; }
    setSaving(true);
    setError("");
    try {
      await api(`${config.path}`, {
        method: "POST",
        body: JSON.stringify(toPayload(config.fields, values, status)),
      });
      onSaved(`${config.label} created`);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overlay center" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="panel-head">
          <h3>New {config.label.toLowerCase()}</h3>
          <button className="close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <FormFields
          fields={config.fields}
          values={values}
          setValues={setValues}
          status={status}
          setStatus={setStatus}
          statuses={statuses}
        />
        {error && <div className="field-error">{error}</div>}
        <div className="panel-actions">
          <button className="btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn-solid" onClick={save} disabled={saving}>{saving ? "Creating…" : "Create"}</button>
        </div>
      </div>
    </div>
  );
}
