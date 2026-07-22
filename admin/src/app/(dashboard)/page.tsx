"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { inr, relativeDate, statusClass, titleCase } from "@/lib/format";

interface Stats {
  totals: Record<string, number>;
  today: Record<string, number>;
  pending: Record<string, number>;
  revenue: { poolTotal: number };
  vendorCounters: { total: number; available: number; booked: number };
}
interface AnalyticsPoint {
  date: string;
  pool: number; hall: number; spa: number;
  gym: number; vendor: number; course: number; contact: number;
}
interface PoolBooking {
  id: string; reference?: string; guestName: string; poolType: string; date: string; totalAmount: number; status: string;
}

function AreaChart({ series }: { series: AnalyticsPoint[] }) {
  const W = 640, H = 200, n = series.length || 1;
  const bookings = series.map((p) => p.pool + p.hall + p.spa);
  const enquiries = series.map((p) => p.gym + p.vendor + p.course + p.contact);
  const max = Math.max(1, ...bookings, ...enquiries) + 2;
  const x = (i: number) => (n === 1 ? W / 2 : (i / (n - 1)) * W);
  const y = (v: number) => H - 8 - (v / max) * (H - 24);
  const path = (arr: number[], close: boolean) => {
    if (!arr.length) return "";
    let d = `M${x(0).toFixed(1)},${y(arr[0]).toFixed(1)}`;
    for (let i = 1; i < arr.length; i++) d += `L${x(i).toFixed(1)},${y(arr[i]).toFixed(1)}`;
    if (close) d += `L${W},${H}L0,${H}Z`;
    return d;
  };
  const grid = [1, 2, 3].map((g) => 8 + (g * (H - 24)) / 4);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: 200, display: "block" }}>
      <defs>
        <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--brand)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map((gy, i) => (
        <line key={i} x1="0" y1={gy} x2={W} y2={gy} stroke="var(--line)" strokeWidth="1" />
      ))}
      <path d={path(bookings, true)} fill="url(#ga)" />
      <path d={path(bookings, false)} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={path(enquiries, false)} fill="none" stroke="var(--info)" strokeWidth="2" strokeLinejoin="round" />
      {series.length > 0 && (
        <circle cx={x(n - 1)} cy={y(bookings[n - 1])} r="4" fill="var(--brand)" stroke="var(--surface)" strokeWidth="2" />
      )}
    </svg>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [series, setSeries] = useState<AnalyticsPoint[]>([]);
  const [recent, setRecent] = useState<PoolBooking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api<Stats>("/api/admin/dashboard/stats"),
      api<{ series: AnalyticsPoint[] }>("/api/admin/dashboard/analytics?range=30"),
      api<PoolBooking[]>("/api/admin/pool-bookings?limit=5&sortBy=createdAt&sortDir=desc"),
    ])
      .then(([s, a, r]) => {
        setStats(s.data);
        setSeries(a.data.series);
        setRecent(r.data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const totalWindow = useMemo(
    () => series.reduce((sum, p) => sum + p.pool + p.hall + p.spa + p.gym + p.vendor + p.course + p.contact, 0),
    [series]
  );

  // Per-area cards / bars: [label, count, href, icon]
  const areas = useMemo(() => {
    if (!stats) return [] as Array<{ label: string; count: number; href: string; icon: string }>;
    const t = stats.totals;
    return [
      { label: "Pool bookings", count: t.poolBookings ?? 0, href: "/bookings", icon: "🏊" },
      { label: "Hall bookings", count: t.hallBookings ?? 0, href: "/hall", icon: "🏛" },
      { label: "Spa bookings", count: t.spaBookings ?? 0, href: "/bookings", icon: "💆" },
      { label: "Gym enquiries", count: t.gymMemberships ?? 0, href: "/gym", icon: "🏋" },
      { label: "Vendor enquiries", count: t.vendorInvites ?? 0, href: "/enquiries", icon: "🛍" },
      { label: "Course enrollments", count: t.courseRegistrations ?? 0, href: "/enrollments", icon: "🎓" },
      { label: "Contact enquiries", count: t.contactEnquiries ?? 0, href: "/enquiries", icon: "✉" },
      { label: "Vendor counters", count: stats.vendorCounters.booked, href: "/counters", icon: "▣" },
    ];
  }, [stats]);

  const serviceBars = useMemo(
    () =>
      areas
        .filter((a) => a.label !== "Vendor counters" && a.label !== "Contact enquiries")
        .map((a) => ({ label: a.label.split(" ")[0], count: a.count, href: a.href })),
    [areas]
  );
  const barMax = Math.max(1, ...serviceBars.map((r) => r.count));

  // Needs-attention items (only rendered when > 0)
  const attention = useMemo(() => {
    if (!stats) return [] as Array<{ label: string; count: number; href: string; tone: "warn" | "bad" }>;
    return [
      { label: "Hall bookings awaiting confirmation", count: stats.pending.hallBookings ?? 0, href: "/hall", tone: "warn" as const },
      { label: "Spa bookings awaiting confirmation", count: stats.pending.spaBookings ?? 0, href: "/bookings", tone: "warn" as const },
      { label: "New contact leads", count: stats.pending.newContactEnquiries ?? 0, href: "/enquiries", tone: "warn" as const },
      { label: "Counters booked", count: stats.vendorCounters.booked ?? 0, href: "/counters", tone: "bad" as const },
    ].filter((a) => a.count > 0);
  }, [stats]);

  if (loading) {
    return (
      <div className="grid stat-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card stat">
            <div className="skeleton" style={{ height: 60 }} />
          </div>
        ))}
      </div>
    );
  }
  if (error) return <div className="empty">{error}</div>;
  if (!stats) return null;

  return (
    <>
      {/* Headline stats — each links to its area */}
      <div className="grid stat-grid">
        <Link href="/bookings" className="card stat card-link">
          <div className="stat-top"><span className="stat-label">Total bookings</span><span className="stat-ic">▦</span></div>
          <div className="stat-val tnum">{stats.totals.bookings.toLocaleString("en-IN")}</div>
          <span className="delta up">▲ {stats.today.poolBookings + stats.today.hallBookings + stats.today.spaBookings} today</span>
        </Link>
        <Link href="/enquiries" className="card stat card-link">
          <div className="stat-top"><span className="stat-label">Total enquiries</span><span className="stat-ic">✉</span></div>
          <div className="stat-val tnum">{stats.totals.enquiries.toLocaleString("en-IN")}</div>
          <span className="delta flat">{stats.pending.newContactEnquiries} new contact leads</span>
        </Link>
        <Link href="/bookings" className="card stat card-link">
          <div className="stat-top"><span className="stat-label">Pool revenue</span><span className="stat-ic">₹</span></div>
          <div className="stat-val tnum">{inr(stats.revenue.poolTotal)}</div>
          <span className="delta flat">confirmed bookings</span>
        </Link>
        <Link href="/counters" className="card stat card-link">
          <div className="stat-top"><span className="stat-label">Counters available</span><span className="stat-ic">▣</span></div>
          <div className="stat-val tnum">{stats.vendorCounters.available} / {stats.vendorCounters.total}</div>
          <span className={stats.vendorCounters.booked > 0 ? "delta down" : "delta flat"}>
            {stats.vendorCounters.booked} booked
          </span>
        </Link>
      </div>

      {/* Needs attention */}
      {attention.length > 0 && (
        <>
          <div className="section-head"><h2>Needs attention</h2></div>
          <div className="area-grid">
            {attention.map((a) => (
              <Link key={a.label} href={a.href} className={`card attn ${a.tone} card-link`}>
                <span className="badge">{a.count}</span>
                <span className="t">{a.label}</span>
                <span className="arrow">→</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Trend + service split */}
      <div className="two-col" style={{ marginTop: 16 }}>
        <div className="card chart-card">
          <div className="chart-head">
            <div>
              <div className="stat-label">Bookings &amp; enquiries</div>
              <div className="big tnum">{totalWindow} <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>last 30 days</span></div>
            </div>
            <div className="legend">
              <span><i style={{ background: "var(--brand)" }} />Bookings</span>
              <span><i style={{ background: "var(--info)" }} />Enquiries</span>
            </div>
          </div>
          <AreaChart series={series} />
        </div>
        <div className="card chart-card">
          <div className="stat-label" style={{ marginBottom: 14 }}>By service</div>
          <div className="bars">
            {serviceBars.map((s) => (
              <Link className="bar-row link" href={s.href} key={s.label} style={{ textDecoration: "none", color: "inherit" }}>
                <span style={{ color: "var(--muted)" }}>{s.label}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(s.count / barMax) * 100}%` }} /></div>
                <span className="tnum" style={{ textAlign: "right", fontWeight: 650 }}>{s.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Manage by area — each booking / enquiry type, click through */}
      <div className="section-head"><h2>Manage by area</h2></div>
      <div className="area-grid">
        {areas.map((a) => (
          <Link key={a.label} href={a.href} className="card area-card card-link">
            <span className="ic">{a.icon}</span>
            <div>
              <div className="n tnum">{a.count.toLocaleString("en-IN")}</div>
              <div className="l">{a.label}</div>
            </div>
            <span className="arrow">→</span>
          </Link>
        ))}
      </div>

      {/* Recent pool bookings */}
      <div className="section-head"><h2>Recent pool bookings</h2><Link href="/bookings" className="link">View all →</Link></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Booking ID</th><th>Guest</th><th>Plan</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {recent.length === 0 ? (
              <tr><td colSpan={6} className="empty">No bookings yet.</td></tr>
            ) : (
              recent.map((r) => (
                <tr key={r.id}>
                  <td className="tnum" style={{ fontWeight: 650 }}>{r.reference ?? "—"}</td>
                  <td className="who">{r.guestName}</td>
                  <td>{r.poolType}</td>
                  <td>{relativeDate(r.date)}</td>
                  <td className="tnum">{inr(r.totalAmount)}</td>
                  <td><span className={`chip ${statusClass(r.status)}`}>{titleCase(r.status)}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
