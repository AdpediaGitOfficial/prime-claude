"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Toast } from "@/components/Toast";

type Role = "SUPER_ADMIN" | "ADMIN" | "STAFF";

interface AdminRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

const ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "STAFF"];
const roleLabel = (r: Role) => r.replace(/_/g, " ").toLowerCase();

function fmt(dt: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface FormState {
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
}

const emptyForm: FormState = { name: "", email: "", password: "", role: "ADMIN", isActive: true };

export default function UsersPage() {
  const { admin: me } = useAuth();
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [editing, setEditing] = useState<AdminRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<AdminRow | null>(null);
  const [resetFor, setResetFor] = useState<AdminRow | null>(null);
  const [generatedPw, setGeneratedPw] = useState<{ name: string; password: string } | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const load = () => {
    setLoading(true);
    api<AdminRow[]>("/api/admin/admins")
      .then((res) => setRows(res.data))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load users"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (me && me.role !== "SUPER_ADMIN") {
    return <div className="empty">Only super admins can manage users.</div>;
  }

  const openCreate = () => {
    setForm(emptyForm);
    setFormError("");
    setCreating(true);
  };

  const openEdit = (row: AdminRow) => {
    setForm({ name: row.name, email: row.email, password: "", role: row.role, isActive: row.isActive });
    setFormError("");
    setEditing(row);
  };

  const closePanel = () => {
    setCreating(false);
    setEditing(null);
    setFormError("");
  };

  const submit = async () => {
    setFormError("");
    if (!form.name.trim()) return setFormError("Name is required.");
    if (!form.email.trim()) return setFormError("Email is required.");
    if (creating && form.password.length < 8) return setFormError("Password must be at least 8 characters.");

    setSaving(true);
    try {
      if (creating) {
        await api("/api/admin/admins", {
          method: "POST",
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role,
          }),
        });
        setToast("User created");
      } else if (editing) {
        const body: Record<string, unknown> = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          isActive: form.isActive,
        };
        await api(`/api/admin/admins/${editing.id}`, { method: "PUT", body: JSON.stringify(body) });
        setToast("User updated");
      }
      closePanel();
      load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const doResetPassword = async () => {
    if (!resetFor) return;
    setActionBusy(true);
    try {
      const res = await api<{ id: string; password: string }>(
        `/api/admin/admins/${resetFor.id}/reset-password`,
        { method: "POST", body: JSON.stringify({}) }
      );
      setGeneratedPw({ name: resetFor.name, password: res.data.password });
      setResetFor(null);
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Reset failed");
    } finally {
      setActionBusy(false);
    }
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    setActionBusy(true);
    try {
      await api(`/api/admin/admins/${confirmDelete.id}`, { method: "DELETE" });
      setToast("User deleted");
      setConfirmDelete(null);
      load();
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setActionBusy(false);
    }
  };

  const copyPw = async () => {
    if (!generatedPw) return;
    try {
      await navigator.clipboard.writeText(generatedPw.password);
      setToast("Password copied");
    } catch {
      setToast("Copy failed — select the text manually");
    }
  };

  return (
    <>
      <div className="toolbar">
        <div style={{ marginRight: "auto", color: "var(--muted)", fontSize: 13 }}>
          {rows.length} user{rows.length === 1 ? "" : "s"}
        </div>
        <button className="btn-solid" onClick={openCreate}>
          ＋ Add user
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last login</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="empty">
                  <div className="spinner" style={{ margin: "0 auto" }} />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="empty">
                  {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty">
                  No users yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const isMe = me?.id === row.id;
                return (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 600 }}>
                      {row.name}
                      {isMe && <span className="chip plain brand" style={{ marginLeft: 8 }}>you</span>}
                    </td>
                    <td>{row.email}</td>
                    <td>
                      <span className={`chip plain ${row.role === "SUPER_ADMIN" ? "brand" : "info"}`}>
                        {roleLabel(row.role)}
                      </span>
                    </td>
                    <td>
                      <span className={`chip ${row.isActive ? "good" : "bad"}`}>
                        {row.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 13 }}>{fmt(row.lastLoginAt)}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button className="btn-outline" onClick={() => openEdit(row)}>
                        Edit
                      </button>{" "}
                      <button className="btn-outline" onClick={() => setResetFor(row)}>
                        Reset password
                      </button>{" "}
                      <button
                        className="btn-outline"
                        style={{ color: "var(--bad)" }}
                        disabled={isMe}
                        title={isMe ? "You cannot delete your own account" : undefined}
                        onClick={() => setConfirmDelete(row)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create / edit drawer */}
      {(creating || editing) && (
        <div className="overlay" onClick={closePanel}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <h3>{creating ? "Add user" : "Edit user"}</h3>
              <button className="close" onClick={closePanel}>
                ✕
              </button>
            </div>

            <div className="field">
              <label>Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {creating && (
              <div className="field">
                <label>Temporary password</label>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters"
                />
              </div>
            )}
            <div className="field">
              <label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {roleLabel(r)}
                  </option>
                ))}
              </select>
            </div>
            {editing && (
              <div className="field">
                <label>Status</label>
                <select
                  value={form.isActive ? "active" : "inactive"}
                  disabled={me?.id === editing.id}
                  onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {me?.id === editing.id && (
                  <div className="brand-sub" style={{ marginTop: 6 }}>
                    You cannot deactivate your own account.
                  </div>
                )}
              </div>
            )}

            {formError && (
              <div className="chip bad" style={{ marginTop: 4 }}>
                {formError}
              </div>
            )}

            <div className="panel-actions">
              <button className="btn-outline" onClick={closePanel} disabled={saving}>
                Cancel
              </button>
              <button className="btn-solid" onClick={submit} disabled={saving}>
                {saving ? "Saving…" : creating ? "Create user" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset-password confirm */}
      {resetFor && (
        <div className="overlay center" onClick={() => setResetFor(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <h3>Reset password</h3>
              <button className="close" onClick={() => setResetFor(null)}>
                ✕
              </button>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>
              Generate a new password for <strong>{resetFor.name}</strong> ({resetFor.email})? Their current
              sessions will be signed out, and the new password will be shown to you once to hand over.
            </p>
            <div className="panel-actions">
              <button className="btn-outline" onClick={() => setResetFor(null)} disabled={actionBusy}>
                Cancel
              </button>
              <button className="btn-solid" onClick={doResetPassword} disabled={actionBusy}>
                {actionBusy ? "Resetting…" : "Reset password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated-password reveal (shown once) */}
      {generatedPw && (
        <div className="overlay center" onClick={() => setGeneratedPw(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <h3>New password for {generatedPw.name}</h3>
              <button className="close" onClick={() => setGeneratedPw(null)}>
                ✕
              </button>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              Copy this now — it is shown only once and cannot be retrieved later.
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                background: "var(--ground)",
                border: "1px solid var(--line)",
                borderRadius: 11,
                padding: "12px 14px",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 17,
                letterSpacing: ".02em",
                margin: "6px 0 4px",
              }}
            >
              <span style={{ userSelect: "all", flex: 1, wordBreak: "break-all" }}>{generatedPw.password}</span>
              <button className="btn-outline" onClick={copyPw}>
                Copy
              </button>
            </div>
            <div className="panel-actions">
              <button className="btn-solid" onClick={() => setGeneratedPw(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="overlay center" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <h3>Delete user</h3>
              <button className="close" onClick={() => setConfirmDelete(null)}>
                ✕
              </button>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>
              Permanently delete <strong>{confirmDelete.name}</strong> ({confirmDelete.email})? This cannot be
              undone. Their login history is retained.
            </p>
            <div className="panel-actions">
              <button className="btn-outline" onClick={() => setConfirmDelete(null)} disabled={actionBusy}>
                Cancel
              </button>
              <button
                className="btn-solid"
                style={{ background: "var(--bad)" }}
                onClick={doDelete}
                disabled={actionBusy}
              >
                {actionBusy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onDone={() => setToast("")} />
    </>
  );
}
