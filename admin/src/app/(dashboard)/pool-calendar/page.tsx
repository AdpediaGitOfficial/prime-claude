"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { sanitizeName, sanitizePhone, isValidName, isValidPhone, NAME_ERROR, PHONE_ERROR } from "@/lib/validation";

// ── Domain constants (mirror the backend + website) ──
const OPEN = 600, CLOSE = 1320; // 10:00 AM – 10:00 PM
const ADDON = 500, GST = 0.18;
const PLANS: Record<string, { d: number; price: number; group: boolean; cap: string }> = {
  Solo: { d: 60, price: 500, group: false, cap: "≤8" },
  Duo: { d: 60, price: 1000, group: false, cap: "≤8" },
  Session: { d: 90, price: 1500, group: false, cap: "≤8" },
  "Group Function": { d: 180, price: 3000, group: true, cap: "≤12" },
};
const MON = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const P1 = "#0f9fb4", P2 = "#5566d4";

interface Booking {
  id: string; reference: string; guestName: string; phone: string; email?: string | null;
  poolId: number | null; poolType: string; timeSlot: string; status: string; source: string;
  addons?: string[]; totalAmount?: number;
}
interface CalData { date: string; pool1: Booking[]; pool2: Booking[]; }
interface MonthDay { date: string; pool1Mins: number; pool2Mins: number; count: number; }

// ── Helpers ──
const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const fmt = (m: number) => { const h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? "PM" : "AM", h12 = (h % 12) || 12; return `${h12}:${pad(mm)} ${ap}`; };
function parseMin(t: string): number | null {
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10); const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12; if (ap === "AM" && h === 12) h = 0;
  return h * 60 + parseInt(m[2], 10);
}
function slotRange(ts: string): { s: number; e: number } | null {
  const [a, b] = ts.split(/\s*-\s*/); if (!a || !b) return null;
  const s = parseMin(a), e = parseMin(b); if (s == null || e == null) return null; return { s, e };
}
const eligibleFor = (plan: string) => (PLANS[plan]?.group ? [2] : [1, 2]);
const overlaps = (s1: number, e1: number, s2: number, e2: number) => s1 < e2 && e1 > s2;

/**
 * Pack a lane's bookings so overlapping ones sit side-by-side (never stacked).
 * Returns each booking with its sub-column index `col` and the total number of
 * sub-columns `cols` in its overlap cluster.
 */
type Packed = { b: Booking; r: { s: number; e: number }; col: number; cols: number };
function packLanes(list: Booking[]): Packed[] {
  const items = list
    .map((b) => ({ b, r: slotRange(b.timeSlot) }))
    .filter((x): x is { b: Booking; r: { s: number; e: number } } => x.r !== null)
    .sort((a, b) => a.r.s - b.r.s || a.r.e - b.r.e);
  const out: Packed[] = [];
  let cluster: Array<{ b: Booking; r: { s: number; e: number }; col: number }> = [];
  let clusterEnd = -1;
  const flush = () => {
    if (!cluster.length) return;
    const colEnds: number[] = [];
    for (const it of cluster) {
      let c = 0;
      for (; c < colEnds.length; c++) if (it.r.s >= colEnds[c]) break;
      if (c === colEnds.length) colEnds.push(it.r.e);
      else colEnds[c] = it.r.e;
      it.col = c;
    }
    const cols = colEnds.length;
    for (const it of cluster) out.push({ ...it, cols });
    cluster = [];
    clusterEnd = -1;
  };
  for (const it of items) {
    if (cluster.length && it.r.s >= clusterEnd) flush();
    cluster.push({ ...it, col: 0 });
    clusterEnd = Math.max(clusterEnd, it.r.e);
  }
  flush();
  return out;
}
function breakdown(plan: string, addons: string[]) {
  const base = PLANS[plan]?.price ?? 0, add = addons.length * ADDON, sub = base + add;
  const gst = Math.round(sub * GST); return { base, add, sub, gst, total: sub + gst };
}
const todayISO = () => { const d = new Date(); return iso(d.getFullYear(), d.getMonth(), d.getDate()); };

export default function PoolCalendarPage() {
  const [view, setView] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [sel, setSel] = useState(todayISO);
  const [month, setMonth] = useState<Record<string, MonthDay>>({});
  const [day, setDay] = useState<CalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [drawer, setDrawer] = useState<{ kind: "manage"; b: Booking } | { kind: "block"; pool: number; start: number } | null>(null);
  const [toast, setToast] = useState("");

  const loadMonth = useCallback((y: number, m: number) => {
    api<MonthDay[]>(`/api/admin/pool-bookings/month?month=${y}-${pad(m + 1)}`)
      .then((r) => setMonth(Object.fromEntries(r.data.map((d) => [d.date, d]))))
      .catch(() => setMonth({}));
  }, []);
  const loadDay = useCallback((d: string) => {
    setLoading(true);
    api<CalData>(`/api/admin/pool-bookings/calendar?date=${d}`)
      .then((r) => { setDay(r.data); setErr(""); })
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadMonth(view.y, view.m); }, [view, loadMonth]);
  useEffect(() => { loadDay(sel); }, [sel, loadDay]);

  const bookings = useMemo(() => (day ? [...day.pool1, ...day.pool2] : []), [day]);
  const active = useMemo(() => bookings.filter((b) => b.status !== "CANCELLED"), [bookings]);
  const poolFreeAt = useCallback((pool: number, s: number, e: number) =>
    !active.some((b) => (b.poolId ?? 1) === pool && (() => { const r = slotRange(b.timeSlot); return r ? overlaps(s, e, r.s, r.e) : false; })()),
    [active]);

  const reload = () => { loadDay(sel); loadMonth(view.y, view.m); };

  // ── Month calendar ──
  const monthCells = useMemo(() => {
    const first = new Date(view.y, view.m, 1).getDay();
    const days = new Date(view.y, view.m + 1, 0).getDate();
    const cells: Array<{ d: number; id: string } | null> = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push({ d, id: iso(view.y, view.m, d) });
    return cells;
  }, [view]);
  const prevMonth = () => setView((v) => { const m = v.m - 1; return m < 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m }; });
  const nextMonth = () => setView((v) => { const m = v.m + 1; return m > 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m }; });
  const jumpToday = () => { const d = new Date(); setView({ y: d.getFullYear(), m: d.getMonth() }); setSel(todayISO()); };

  const free1 = Math.max(0, 720 - active.filter((b) => (b.poolId ?? 1) === 1).reduce((a, b) => { const r = slotRange(b.timeSlot); return a + (r ? r.e - r.s : 0); }, 0));
  const free2 = Math.max(0, 720 - active.filter((b) => b.poolId === 2).reduce((a, b) => { const r = slotRange(b.timeSlot); return a + (r ? r.e - r.s : 0); }, 0));
  const hf = (x: number) => (x / 60).toFixed(1).replace(/\.0$/, "");

  const selDate = new Date(sel + "T00:00:00");

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18, alignItems: "start" }} className="pc-layout">
        {/* Month calendar */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <button className="mini" onClick={prevMonth} aria-label="Previous month" style={{ fontSize: 16 }}>‹</button>
            <div style={{ flex: 1, textAlign: "center", fontWeight: 750, fontSize: 16 }}>{MON[view.m]} {view.y}</div>
            <button className="mini" onClick={nextMonth} aria-label="Next month" style={{ fontSize: 16 }}>›</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 6 }}>
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => <span key={d} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 650, color: "var(--muted)", textTransform: "uppercase" }}>{d}</span>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {monthCells.map((c, i) => {
              if (!c) return <div key={i} />;
              const md = month[c.id];
              const l1 = md ? Math.min(1, md.pool1Mins / 720) : 0, l2 = md ? Math.min(1, md.pool2Mins / 720) : 0;
              const isToday = c.id === todayISO(), isSel = c.id === sel, isPast = c.id < todayISO();
              return (
                <button key={i} onClick={() => !isPast && setSel(c.id)} disabled={isPast} title={isPast ? "Past date — bookings can't be taken in the past" : undefined}
                  style={{ aspectRatio: "1/1.08", border: isToday ? "1.5px solid var(--brand)" : "1px solid transparent", borderRadius: 10, background: isSel ? "var(--ink)" : "var(--ground)", color: isSel ? "var(--surface)" : "inherit", cursor: isPast ? "not-allowed" : "pointer", opacity: isPast ? 0.4 : 1, padding: "5px 0 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, textDecoration: isPast ? "line-through" : "none" }}>{c.d}</span>
                  <div style={{ width: "60%", marginTop: "auto", marginBottom: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                    {(l1 > 0 || l2 > 0) && <>
                      <div style={{ height: 3, borderRadius: 2, background: "rgba(120,140,140,.25)", overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.max(l1 > 0 ? 18 : 0, l1 * 100)}%`, background: P1 }} /></div>
                      <div style={{ height: 3, borderRadius: 2, background: "rgba(120,140,140,.25)", overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.max(l2 > 0 ? 18 : 0, l2 * 100)}%`, background: P2 }} /></div>
                    </>}
                  </div>
                </button>
              );
            })}
          </div>
          <button className="btn-outline" onClick={jumpToday} style={{ width: "100%", marginTop: 12, padding: 8, fontSize: 13 }}>Jump to today</button>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)", fontSize: 11.5, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><i style={{ width: 14, height: 4, borderRadius: 2, background: P1, display: "inline-block" }} /> Pool 1 load</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><i style={{ width: 14, height: 4, borderRadius: 2, background: P2, display: "inline-block" }} /> Pool 2 load</span>
          </div>
        </div>

        {/* Day schedule */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "15px 18px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 750 }}>{SHORT[selDate.getDay()]} · {selDate.getDate()} {MON[selDate.getMonth()].slice(0, 3)} {selDate.getFullYear()}</h2>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <Stat label="Pool 1 free" val={`${hf(free1)}h`} c={P1} />
              <Stat label="Pool 2 free" val={`${hf(free2)}h`} c={P2} />
              <Stat label="Bookings" val={String(active.length)} />
            </div>
          </div>
          {loading ? <div style={{ padding: 24 }}><div className="skeleton" style={{ height: 160 }} /></div>
            : err ? <div className="empty">{err}</div>
            : <DayGrid day={day} onBooking={(b) => setDrawer({ kind: "manage", b })} onGap={(pool, start) => setDrawer({ kind: "block", pool, start })} />}
        </div>
      </div>

      {drawer?.kind === "manage" && <ManageDrawer b={drawer.b} onClose={() => setDrawer(null)} onChanged={(m) => { setToast(m); reload(); }} />}
      {drawer?.kind === "block" && <BlockDrawer date={sel} pool={drawer.pool} start={drawer.start} poolFreeAt={poolFreeAt}
        onClose={() => setDrawer(null)} onSaved={(m) => { setToast(m); setDrawer(null); reload(); }} />}
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}

      <style>{`
        @media (max-width: 900px){ .pc-layout{ grid-template-columns:1fr !important; } }
        .mini{border:1px solid var(--line);background:var(--ground);color:var(--ink);width:34px;height:34px;border-radius:9px;cursor:pointer;}
        .mini:hover{border-color:var(--brand);}
      `}</style>
    </>
  );
}

function Stat({ label, val, c }: { label: string; val: string; c?: string }) {
  return (
    <div style={{ background: "var(--ground)", border: "1px solid var(--line)", borderRadius: 10, padding: "6px 11px", minWidth: 92 }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
        {c && <span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />}{label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 750, fontVariantNumeric: "tabular-nums" }}>{val}</div>
    </div>
  );
}

function DayGrid({ day, onBooking, onGap }: { day: CalData | null; onBooking: (b: Booking) => void; onGap: (pool: number, start: number) => void }) {
  const ROW = 56, PXMIN = ROW / 60;
  const cols: Array<{ pool: number; label: string; color: string; list: Booking[] }> = [
    { pool: 1, label: "Pool 1 · small ≤8", color: P1, list: day?.pool1 ?? [] },
    { pool: 2, label: "Pool 2 · group ≤12", color: P2, list: day?.pool2 ?? [] },
  ];
  const statusColor: Record<string, string> = { PENDING: "var(--warn)", CONFIRMED: "var(--good)", COMPLETED: "var(--info)", CANCELLED: "var(--bad)" };
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr", minWidth: 620 }}>
        <div />
        {cols.map((c) => (
          <div key={c.pool} style={{ padding: "10px 12px", borderLeft: "1px solid var(--line)", borderBottom: "1px solid var(--line)", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: c.color }} />{c.label}
          </div>
        ))}
        {/* time axis */}
        <div style={{ position: "relative" }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{ height: ROW, borderBottom: "1px solid var(--line)", position: "relative" }}>
              <span style={{ position: "absolute", top: -8, right: 7, fontSize: 10, color: "var(--muted)" }}>{fmt(OPEN + i * 60).replace(":00", "")}</span>
            </div>
          ))}
          <span style={{ position: "absolute", bottom: -7, right: 7, fontSize: 10, color: "var(--muted)" }}>{fmt(CLOSE).replace(":00", "")}</span>
        </div>
        {/* pool columns */}
        {cols.map((c) => (
          <div key={c.pool} onClick={(e) => {
            if ((e.target as HTMLElement).closest(".bkblock")) return;
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const y = e.clientY - rect.top;
            const start = Math.min(CLOSE - 30, OPEN + Math.round(y / (ROW / 2)) * 30);
            onGap(c.pool, Math.max(OPEN, start));
          }} style={{ position: "relative", borderLeft: "1px solid var(--line)", cursor: "copy" }}>
            {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ height: ROW, borderBottom: "1px solid var(--line)" }} />)}
            {packLanes(c.list).map(({ b, r, col, cols: nCols }) => {
              const cancelled = b.status === "CANCELLED";
              const multi = nCols > 1;
              const pos = multi
                ? { left: `calc(5px + ${col} * (100% - 10px) / ${nCols})`, width: `calc((100% - 10px) / ${nCols} - 3px)` }
                : { left: 5, right: 5 };
              return (
                <button key={b.id} className="bkblock" onClick={() => onBooking(b)} title={`${b.reference} · ${b.guestName} · ${b.poolType} · ${fmt(r.s)}–${fmt(r.e)}`}
                  style={{ position: "absolute", ...pos, top: (r.s - OPEN) * PXMIN, height: (r.e - r.s) * PXMIN, borderRadius: 8, padding: multi ? "5px 6px" : "6px 9px", cursor: "pointer", overflow: "hidden", textAlign: "left", border: `1px solid ${c.color}55`, background: `${c.color}22`, opacity: cancelled ? 0.5 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                    <span style={{ fontFamily: "var(--mono,monospace)", fontSize: 10.5, fontWeight: 650, opacity: 0.85, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.reference}</span>
                    {!multi && <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", color: statusColor[b.status] }}>{b.status[0] + b.status.slice(1).toLowerCase()}</span>}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 12.5, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textDecoration: cancelled ? "line-through" : "none" }}>{b.guestName}</div>
                  <div style={{ fontSize: 10.5, opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{multi ? `${fmt(r.s)}–${fmt(r.e)}` : `${b.poolType} · ${fmt(r.s)}–${fmt(r.e)}`}</div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function PoolPill({ pool }: { pool: number | null }) {
  const p2 = pool === 2;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 12.5, padding: "4px 10px", borderRadius: 7, background: p2 ? "rgba(85,102,212,.14)" : "rgba(15,159,180,.14)", color: p2 ? "#4453c0" : "#0c8394" }}><span style={{ width: 10, height: 10, borderRadius: 3, background: p2 ? P2 : P1 }} />Pool {pool ?? 1} · {p2 ? "group ≤12" : "small ≤8"}</span>;
}

function AmountBox({ plan, addons }: { plan: string; addons: string[] }) {
  const b = breakdown(plan, addons); const has = (a: string) => addons.includes(a);
  const row = (k: string, v: string, mut?: boolean) => <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0", color: mut ? "var(--muted)" : "inherit" }}><span style={{ color: "var(--muted)" }}>{k}</span><span>{v}</span></div>;
  return (
    <div style={{ background: "var(--ground)", border: "1px solid var(--line)", borderRadius: 10, padding: "11px 13px" }}>
      {row(plan, inr(b.base))}
      {row("Jacuzzi", has("Jacuzzi") ? "+ " + inr(ADDON) : "Not added", true)}
      {row("Sauna Bath", has("Sauna Bath") ? "+ " + inr(ADDON) : "Not added", true)}
      {row("Subtotal", inr(b.sub))}
      {row("GST (18%)", "+ " + inr(b.gst))}
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", marginTop: 6, paddingTop: 8, fontWeight: 750, fontSize: 15.5 }}><span>Total incl. GST</span><span>{inr(b.total)}</span></div>
    </div>
  );
}

function Drawer({ title, sub, onClose, children, foot }: { title: string; sub?: string; onClose: () => void; children: React.ReactNode; foot: React.ReactNode }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(6,18,20,.5)", zIndex: 60 }} />
      <div style={{ position: "fixed", top: 0, right: 0, height: "100%", width: "min(400px,94vw)", background: "var(--surface)", borderLeft: "1px solid var(--line)", zIndex: 61, display: "flex", flexDirection: "column", boxShadow: "-10px 0 40px rgba(0,0,0,.2)" }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div><h3 style={{ margin: 0, fontSize: 17, fontWeight: 750 }}>{title}</h3>{sub && <div style={{ fontFamily: "var(--mono,monospace)", fontSize: 12.5, color: "var(--brand)", fontWeight: 650, marginTop: 3 }}>{sub}</div>}</div>
          <button onClick={onClose} aria-label="Close" style={{ border: "none", background: "var(--ground)", width: 30, height: 30, borderRadius: 8, cursor: "pointer", color: "inherit", fontSize: 15 }}>✕</button>
        </div>
        <div style={{ padding: "18px 20px", overflowY: "auto", flex: 1 }}>{children}</div>
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 10 }}>{foot}</div>
      </div>
    </>
  );
}

function ManageDrawer({ b, onClose, onChanged }: { b: Booking; onClose: () => void; onChanged: (m: string) => void }) {
  const [busy, setBusy] = useState(false);
  const r = slotRange(b.timeSlot);
  const kv = (k: string, v: React.ReactNode) => <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 13.5 }}><span style={{ color: "var(--muted)" }}>{k}</span><span style={{ fontWeight: 600, textAlign: "right" }}>{v}</span></div>;
  const setStatus = async (s: string) => { setBusy(true); try { await api(`/api/admin/pool-bookings/${b.id}/status`, { method: "PATCH", body: JSON.stringify({ status: s }) }); onChanged(`Marked ${s.toLowerCase()}`); } catch (e) { alert(e instanceof Error ? e.message : "Failed"); } finally { setBusy(false); } };
  const del = async () => { if (!confirm("Delete this booking permanently?")) return; setBusy(true); try { await api(`/api/admin/pool-bookings/${b.id}`, { method: "DELETE" }); onChanged("Booking deleted"); } catch (e) { alert(e instanceof Error ? e.message : "Failed"); } finally { setBusy(false); } };
  const label = (s: string) => s[0] + s.slice(1).toLowerCase();
  return (
    <Drawer title={b.guestName} sub={b.reference} onClose={onClose}
      foot={<>
        <button className="btn-outline" style={{ flex: 1 }} disabled={busy} onClick={() => setStatus("CANCELLED")}>Cancel booking</button>
        <button style={{ border: "none", borderRadius: 10, padding: "11px 14px", fontWeight: 650, cursor: "pointer", background: "rgba(219,67,73,.14)", color: "var(--bad)" }} disabled={busy} onClick={del}>Delete</button>
      </>}>
      {kv("Pool", <PoolPill pool={b.poolId} />)}
      {kv("Plan", b.poolType)}
      {kv("Time", <span style={{ fontFamily: "var(--mono,monospace)" }}>{r ? `${fmt(r.s)} – ${fmt(r.e)}` : b.timeSlot}</span>)}
      {kv("Phone", <span style={{ fontFamily: "var(--mono,monospace)" }}>{b.phone}</span>)}
      {b.email ? kv("Email", b.email) : null}
      {kv("Source", b.source === "offline" ? "Offline / walk-in" : "Website")}
      <div style={{ fontSize: 11, fontWeight: 650, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)", margin: "18px 0 8px" }}>Amount</div>
      <AmountBox plan={b.poolType} addons={b.addons ?? []} />
      <div style={{ fontSize: 11, fontWeight: 650, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)", margin: "18px 0 8px" }}>Status</div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {["PENDING","CONFIRMED","COMPLETED","CANCELLED"].map((s) => (
          <button key={s} disabled={busy} onClick={() => setStatus(s)}
            style={{ border: b.status === s ? "1px solid var(--ink)" : "1px solid var(--line)", background: b.status === s ? "var(--ink)" : "var(--ground)", color: b.status === s ? "var(--surface)" : "inherit", borderRadius: 8, padding: "7px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>{label(s)}</button>
        ))}
      </div>
    </Drawer>
  );
}

function BlockDrawer({ date, pool, start, poolFreeAt, onClose, onSaved }: {
  date: string; pool: number; start: number; poolFreeAt: (p: number, s: number, e: number) => boolean;
  onClose: () => void; onSaved: (m: string) => void;
}) {
  const [plan, setPlan] = useState("Session");
  const [startMin, setStartMin] = useState<number | null>(null);
  const [poolId, setPoolId] = useState<number | null>(null);
  const [jac, setJac] = useState(false);
  const [sauna, setSauna] = useState(false);
  const [guest, setGuest] = useState("");
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const dur = PLANS[plan].d;
  const availStarts = useMemo(() => {
    const elig = eligibleFor(plan); const out: Array<{ m: number; free: number }> = [];
    for (let m = OPEN; m + dur <= CLOSE; m += 30) { const free = elig.filter((p) => poolFreeAt(p, m, m + dur)).length; if (free > 0) out.push({ m, free }); }
    return out;
  }, [plan, dur, poolFreeAt]);

  // keep a valid start selected (nearest available to the clicked start)
  useEffect(() => {
    if (!availStarts.length) { setStartMin(null); return; }
    setStartMin((cur) => {
      const target = cur ?? start;
      let best = availStarts[0].m; for (const o of availStarts) if (Math.abs(o.m - target) < Math.abs(best - target)) best = o.m;
      return availStarts.some((o) => o.m === (cur ?? -1)) ? cur : best;
    });
  }, [availStarts, start]);

  const freePools = useMemo(() => {
    if (startMin == null) return [] as number[];
    return eligibleFor(plan).filter((p) => poolFreeAt(p, startMin, startMin + dur));
  }, [plan, startMin, dur, poolFreeAt]);
  useEffect(() => { setPoolId((cur) => (cur && freePools.includes(cur) ? cur : (freePools.includes(pool) ? pool : freePools[0] ?? null))); }, [freePools, pool]);

  const addons = [...(jac ? ["Jacuzzi"] : []), ...(sauna ? ["Sauna Bath"] : [])];
  const bd = breakdown(plan, addons);

  const save = async () => {
    if (startMin == null || poolId == null) { setErr("No available time — pick another plan or date."); return; }
    if (!isValidName(guest)) { setErr(NAME_ERROR); return; }
    if (!isValidPhone(phone)) { setErr(PHONE_ERROR); return; }
    setBusy(true); setErr("");
    try {
      await api("/api/admin/pool-bookings", { method: "POST", body: JSON.stringify({
        guestName: guest.trim(), phone: phone.trim(), poolType: plan, date,
        timeSlot: `${fmt(startMin)} - ${fmt(startMin + dur)}`, poolId, addons, totalAmount: bd.total,
      }) });
      onSaved(`Slot blocked · ${inr(bd.total)}`);
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed to block"); setBusy(false); }
  };

  const inputStyle = { width: "100%", padding: "9px 11px", border: "1px solid var(--line)", borderRadius: 9, background: "var(--ground)", color: "inherit", fontSize: 14 } as const;
  const lbl = (t: React.ReactNode) => <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 5 }}>{t}</label>;
  const grp = PLANS[plan].group;

  return (
    <Drawer title="Block a slot" sub={new Date(date + "T00:00:00").toDateString()} onClose={onClose}
      foot={<>
        <button className="btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn-solid" style={{ flex: 1, opacity: busy || startMin == null ? 0.5 : 1 }} disabled={busy || startMin == null} onClick={save}>Block slot</button>
      </>}>
      <div style={{ marginBottom: 12 }}>{lbl("Plan")}<select value={plan} onChange={(e) => setPlan(e.target.value)} style={inputStyle}>{Object.keys(PLANS).map((p) => <option key={p} value={p}>{p} · {PLANS[p].d}min · {PLANS[p].cap}</option>)}</select></div>
      <div style={{ marginBottom: 12 }}>{lbl(<>Start time <span style={{ fontWeight: 500, textTransform: "none" }}>· available times only</span></>)}
        {availStarts.length ?
          <select value={startMin ?? ""} onChange={(e) => setStartMin(+e.target.value)} style={inputStyle}>
            {availStarts.map((o) => <option key={o.m} value={o.m}>{fmt(o.m)} – {fmt(o.m + dur)} · {grp ? "available" : o.free === 2 ? "2 pools free" : "1 pool left"}</option>)}
          </select>
          : <div style={{ ...inputStyle, color: "var(--muted)" }}>No available times for this plan</div>}
      </div>
      <div style={{ marginBottom: 12 }}>{lbl("Pool · free pools for this time")}
        <select value={poolId ?? ""} onChange={(e) => setPoolId(+e.target.value)} style={inputStyle} disabled={!freePools.length}>
          {eligibleFor(plan).map((p) => <option key={p} value={p} disabled={!freePools.includes(p)}>Pool {p} · {p === 2 ? "group (≤12)" : "small (≤8)"}{freePools.includes(p) ? "" : " — booked"}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>{lbl("Add-ons · ₹500 each")}
        {[["Jacuzzi", jac, setJac] as const, ["Sauna Bath", sauna, setSauna] as const].map(([name, val, set]) => (
          <label key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 11px", border: "1px solid var(--line)", borderRadius: 9, background: "var(--ground)", marginBottom: 6, cursor: "pointer" }}>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{name} <span style={{ fontWeight: 500, color: "var(--muted)", fontSize: 12 }}>Individual service</span></span>
            <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--brand)" }} />
          </label>
        ))}
      </div>
      <div style={{ marginBottom: 12 }}>{lbl(<>Guest name <span style={{ color: "var(--bad)" }}>*</span></>)}<input value={guest} onChange={(e) => setGuest(sanitizeName(e.target.value))} placeholder="Customer name" style={inputStyle} /></div>
      <div style={{ marginBottom: 12 }}>{lbl(<>Mobile number <span style={{ color: "var(--bad)" }}>*</span></>)}<input value={phone} onChange={(e) => setPhone(sanitizePhone(e.target.value))} placeholder="10-digit mobile" inputMode="numeric" maxLength={10} style={inputStyle} /></div>
      <div style={{ marginBottom: 10 }}>{lbl("Amount")}<AmountBox plan={plan} addons={addons} /></div>
      {err && <div style={{ color: "var(--bad)", fontSize: 12.5 }}>{err}</div>}
    </Drawer>
  );
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [onDone]);
  return <div style={{ position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)", background: "var(--ink)", color: "var(--surface)", padding: "11px 18px", borderRadius: 10, fontSize: 14, fontWeight: 600, zIndex: 70, boxShadow: "0 8px 30px rgba(0,0,0,.3)" }}>{msg}</div>;
}
