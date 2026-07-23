"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

const OPEN = 600, CLOSE = 1320; // 10:00 AM – 10:00 PM

interface Booking {
  id: string; reference: string; guestName: string; phone: string;
  poolId: number | null; poolType: string; timeSlot: string; status: string; source: string;
}
interface CalendarData { date: string; pool1: Booking[]; pool2: Booking[]; }

function parseMins(t: string): number | null {
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + parseInt(m[2], 10);
}
function slotRange(ts: string): { s: number; e: number } | null {
  const [a, b] = ts.split(/\s*-\s*/);
  if (!a || !b) return null;
  const s = parseMins(a), e = parseMins(b);
  if (s == null || e == null) return null;
  return { s, e };
}
const todayISO = () => new Date().toISOString().slice(0, 10);

function Lane({ label, color, bookings }: { label: string; color: string; bookings: Booking[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", alignItems: "center", gap: 14, marginBottom: 12, minWidth: 640 }}>
      <div style={{ fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 11, height: 11, borderRadius: 3, background: color }} />{label}
      </div>
      <div style={{ position: "relative", height: 48, background: "var(--surface-2, #f3fbfc)", border: "1px solid var(--line, #d6e7ea)", borderRadius: 10 }}>
        {bookings.map((b) => {
          const r = slotRange(b.timeSlot);
          if (!r) return null;
          const left = ((r.s - OPEN) / (CLOSE - OPEN)) * 100;
          const width = ((r.e - r.s) / (CLOSE - OPEN)) * 100;
          return (
            <div key={b.id} title={`${b.reference} · ${b.guestName} · ${b.timeSlot}`}
              style={{ position: "absolute", top: 4, bottom: 4, left: `${left}%`, width: `${width}%`,
                background: color, borderRadius: 7, color: "#fff", fontSize: 11, fontWeight: 650,
                display: "flex", alignItems: "center", padding: "0 8px", overflow: "hidden", whiteSpace: "nowrap" }}>
              {b.reference}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PoolCalendarPage() {
  const [date, setDate] = useState(todayISO());
  const [data, setData] = useState<CalendarData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback((d: string) => {
    setLoading(true);
    api<CalendarData>(`/api/admin/pool-bookings/calendar?date=${encodeURIComponent(d)}`)
      .then((res) => { setData(res.data); setError(""); })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load calendar"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(date); }, [date, load]);

  const ticks = useMemo(() => {
    const out: { pct: number; label: string }[] = [];
    for (let h = 10; h <= 22; h++) out.push({ pct: ((h * 60 - OPEN) / (CLOSE - OPEN)) * 100, label: `${((h % 12) || 12)}${h >= 12 ? "p" : "a"}` });
    return out;
  }, []);

  const rows = useMemo(() => {
    if (!data) return [] as Booking[];
    return [...data.pool1, ...data.pool2].sort((a, b) => (slotRange(a.timeSlot)?.s ?? 0) - (slotRange(b.timeSlot)?.s ?? 0));
  }, [data]);

  return (
    <>
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <label style={{ fontWeight: 650, fontSize: 13 }}>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid var(--line, #d6e7ea)", background: "var(--surface, #fff)", color: "inherit" }} />
          <div style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--muted, #5b6d70)", display: "flex", gap: 16 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><i style={{ width: 14, height: 10, borderRadius: 3, background: "#0f9fb4", display: "inline-block" }} /> Pool 1 · small (≤8)</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><i style={{ width: 14, height: 10, borderRadius: 3, background: "#5566d4", display: "inline-block" }} /> Pool 2 · group (≤12)</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 24 }}><div className="skeleton" style={{ height: 120 }} /></div>
      ) : error ? (
        <div className="empty">{error}</div>
      ) : (
        <>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ overflowX: "auto" }}>
              <Lane label="Pool 1 · small (≤8)" color="#0f9fb4" bookings={data?.pool1 ?? []} />
              <Lane label="Pool 2 · group (≤12)" color="#5566d4" bookings={data?.pool2 ?? []} />
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 14, minWidth: 640 }}>
                <div />
                <div style={{ position: "relative", height: 16 }}>
                  {ticks.map((t, i) => (
                    <span key={i} style={{ position: "absolute", left: `${t.pct}%`, transform: "translateX(-50%)", fontSize: 10.5, color: "var(--muted, #5b6d70)" }}>{t.label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="section-head"><h2>Bookings on {data?.date}</h2></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Ref ID</th><th>Pool</th><th>Guest</th><th>Plan</th><th>Time</th><th>Source</th></tr></thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={6} className="empty">No bookings — both pools free all day.</td></tr>
                ) : rows.map((b) => (
                  <tr key={b.id}>
                    <td className="tnum" style={{ fontWeight: 650 }}>{b.reference}</td>
                    <td><span style={{ fontWeight: 650, fontSize: 12.5, padding: "3px 9px", borderRadius: 7, background: (b.poolId ?? 1) === 2 ? "rgba(85,102,212,.14)" : "rgba(15,159,180,.14)", color: (b.poolId ?? 1) === 2 ? "#4453c0" : "#0c8394" }}>Pool {b.poolId ?? 1}</span></td>
                    <td className="who">{b.guestName}</td>
                    <td>{b.poolType}</td>
                    <td className="tnum">{b.timeSlot}</td>
                    <td className="sub-txt">{b.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
