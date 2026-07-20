"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Toast } from "@/components/Toast";

interface Listing {
  id: string;
  name: string;
  code: string | null;
  isAvailable: boolean;
  order: number;
}

export default function CountersPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const load = () => {
    api<Listing[]>("/api/admin/listings?type=VENDOR_COUNTER")
      .then((res) => setListings([...res.data].sort((a, b) => a.order - b.order)))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load counters"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const { available, booked } = useMemo(() => {
    const av = listings.filter((l) => l.isAvailable).length;
    return { available: av, booked: listings.length - av };
  }, [listings]);

  const toggle = async (listing: Listing) => {
    setBusy(listing.id);
    const next = !listing.isAvailable;
    // optimistic
    setListings((cur) => cur.map((l) => (l.id === listing.id ? { ...l, isAvailable: next } : l)));
    try {
      await api(`/api/admin/listings/${listing.id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ isAvailable: next }),
      });
      setToast(`${listing.name} marked ${next ? "available" : "booked"}`);
    } catch (e) {
      // revert
      setListings((cur) => cur.map((l) => (l.id === listing.id ? { ...l, isAvailable: listing.isAvailable } : l)));
      setToast(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <div className="center-load"><div className="spinner" /></div>;
  if (error) return <div className="empty">{error}</div>;

  return (
    <>
      <div className="counter-head">
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Vendor counter availability</h2>
          <div className="sub" style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 3 }}>
            {available} available · {booked} booked · {listings.length} total
          </div>
        </div>
        <div className="legend-pills">
          <span><i style={{ background: "var(--good)" }} />Available</span>
          <span><i style={{ background: "var(--bad)" }} />Booked</span>
        </div>
      </div>

      <div className="counter-grid">
        {listings.map((l) => (
          <div key={l.id} className={`counter ${l.isAvailable ? "free" : "booked"}`}>
            <div className="counter-foot"><span className="cn">{l.name}</span></div>
            <div className="counter-foot">
              <span className="cs">{l.isAvailable ? "Available" : "Booked"}</span>
              <button
                className={`toggle ${l.isAvailable ? "" : "off"}`}
                onClick={() => toggle(l)}
                disabled={busy === l.id}
                title="Toggle availability"
                aria-label={`Mark ${l.name} ${l.isAvailable ? "booked" : "available"}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="note">
        Toggling a counter here flips its availability on the live <strong>/vendor</strong> page instantly —
        booked counters show greyed and can&apos;t be selected by customers.
      </div>

      <Toast message={toast} onDone={() => setToast("")} />
    </>
  );
}
