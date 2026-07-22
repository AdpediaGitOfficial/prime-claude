"use client";

import PoolTimeSlots, { type Slot } from "@/components/PoolTimeSlots";
import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaStarOfLife, FaCrown } from "react-icons/fa6";
import { apiCall, ENDPOINTS } from "@/utils/api";

type PlanId = "solo" | "duo" | "session" | "group";

type Plan = {
  id: PlanId;
  name: string;
  caption: string;
  badge: string;
  price: number;
  durationMinutes: number;
  popular?: boolean;
  features: string[];
};

// Rate card — priced per session, jacuzzi & sauna added separately at ₹500 each.
// Default catalog (used as the fallback if the API is unreachable). Kept in
// sync with the admin-managed POOL listings so the page looks identical.
const DEFAULT_PLANS: Plan[] = [
  {
    id: "solo",
    name: "Solo",
    caption: "Just you",
    badge: "1 person",
    price: 500,
    durationMinutes: 60,
    features: ["Ozone, temperature-controlled pool", "Private cabana", "Premium towel service"],
  },
  {
    id: "duo",
    name: "Duo",
    caption: "For two",
    badge: "2 people",
    price: 1000,
    durationMinutes: 60,
    features: ["Ozone, temperature-controlled pool", "Private cabana", "Premium towel service"],
  },
  {
    id: "session",
    name: "Session",
    caption: "Small groups & families",
    badge: "Up to 8 people",
    price: 1500,
    durationMinutes: 90,
    popular: true,
    features: [
      "Ozone, temperature-controlled pool",
      "Private cabanas & towel service",
      "Dedicated speaker system",
      "Kids above 5 years welcome",
    ],
  },
  {
    id: "group",
    name: "Group Function",
    caption: "Parties & celebrations",
    badge: "Up to 12",
    price: 3000,
    durationMinutes: 180,
    features: [
      "Entire pool reserved for your group",
      "Private cabanas & towel service",
      "Dedicated speaker system",
      "Food from Promenade Café on request",
    ],
  },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const durationText = (m: number) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h && min ? `${h}h ${min}m` : h ? `${h} hour${h > 1 ? "s" : ""}` : `${min} min`;
};

const CODE_TO_ID: Record<string, PlanId> = {
  "POOL-SOLO": "solo",
  "POOL-DUO": "duo",
  "POOL-SESSION": "session",
  "POOL-GROUP": "group",
};

/** Map an admin POOL listing onto the page's Plan shape. */
function listingToPlan(l: {
  code?: string | null;
  name?: string;
  price?: number | null;
  durationLabel?: string | null;
  metadata?: Record<string, unknown> | null;
}): Plan | null {
  const id = l.code ? CODE_TO_ID[l.code] : undefined;
  if (!id) return null;
  const meta = (l.metadata ?? {}) as {
    caption?: string; badge?: string; popular?: boolean; features?: unknown;
  };
  const mins = Number.parseInt(String(l.durationLabel ?? "").match(/\d+/)?.[0] ?? "90", 10);
  return {
    id,
    name: l.name ?? "",
    caption: meta.caption ?? "",
    badge: meta.badge ?? "",
    price: l.price ?? 0,
    durationMinutes: Number.isFinite(mins) ? mins : 90,
    popular: Boolean(meta.popular),
    features: Array.isArray(meta.features) ? (meta.features as string[]) : [],
  };
}

export default function PoolBookingPage() {
  // Live catalog from the admin (falls back to DEFAULT_PLANS if unreachable).
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  useEffect(() => {
    let active = true;
    apiCall(`${ENDPOINTS.LISTINGS}?type=POOL`)
      .then((rows) => {
        if (!active || !Array.isArray(rows)) return;
        const mapped = rows.map(listingToPlan).filter((p): p is Plan => p !== null);
        if (mapped.length) setPlans(mapped);
      })
      .catch(() => {
        /* keep DEFAULT_PLANS */
      });
    return () => {
      active = false;
    };
  }, []);

  const [selectedPool, setSelectedPool] = useState<PlanId | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Live pool occupancy for the chosen date → drives per-slot availability.
  const [poolOccupied, setPoolOccupied] = useState<{ start: number; end: number }[]>([]);
  const [poolCapacity, setPoolCapacity] = useState(2);

  const refreshAvailability = useCallback((date: string) => {
    if (!date) {
      setPoolOccupied([]);
      return;
    }
    apiCall(`${ENDPOINTS.POOL_BOOKINGS}?date=${encodeURIComponent(date)}`)
      .then((res) => {
        setPoolOccupied(Array.isArray(res?.occupied) ? res.occupied : []);
        if (typeof res?.capacity === "number") setPoolCapacity(res.capacity);
      })
      .catch(() => setPoolOccupied([]));
  }, []);

  useEffect(() => {
    refreshAvailability(selectedDate);
  }, [selectedDate, refreshAvailability]);
  const [addons, setAddons] = useState({ sauna: false, jacuzzi: false });
  const [policies, setPolicies] = useState({ dressCode: false, kids: false, terms: false });

  const selectedPlan = plans.find((p) => p.id === selectedPool) ?? null;
  const bookingTotal =
    (selectedPlan?.price ?? 0) + (addons.sauna ? 500 : 0) + (addons.jacuzzi ? 500 : 0);

  // Next 14 selectable days as chips (value is an ISO yyyy-mm-dd string).
  const dateOptions = useMemo(() => {
    const base = new Date();
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const dow = i === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" });
      return { iso, dow, dnum: d.getDate() };
    });
  }, []);

  const [showMobileModal, setShowMobileModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState<string>("");

  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });

  const handleConfirmBooking = () => {
    if (!selectedPool) {
      setMessage("Please select a plan.");
      scrollToSection("pool-plans");
      return;
    }
    if (!selectedDate) {
      setMessage("Please select a date.");
      scrollToSection("pool-datetime");
      return;
    }
    if (!selectedSlot) {
      setMessage("Please select a time slot.");
      scrollToSection("pool-datetime");
      return;
    }
    if (!policies.dressCode || !policies.kids || !policies.terms) {
      setMessage("Please accept all policies and the terms.");
      scrollToSection("pool-policies");
      return;
    }
    setMessage(null);
    setShowMobileModal(true);
  };

  const handlePlaceBooking = async () => {
    if (!guestName.trim()) return setMessage("Please enter your name.");
    if (!/^\d{10}$/.test(mobile)) return setMessage("Enter a valid 10-digit mobile number.");
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setMessage("Enter a valid email, or leave it blank.");
    setLoading(true);
    try {
      const addonsList: string[] = [
        ...(addons.sauna ? ["Sauna Bath"] : []),
        ...(addons.jacuzzi ? ["Jacuzzi"] : []),
      ];
      const booking = await apiCall(ENDPOINTS.POOL_BOOKINGS, {
        method: "POST",
        body: JSON.stringify({
          guest: guestName.trim(),
          phone: "+91" + mobile,
          email: email.trim(),
          poolType: selectedPlan ? selectedPlan.name : "",
          date: selectedDate,
          timeSlot: `${selectedSlot!.start} - ${selectedSlot!.end}`,
          addons: addonsList,
          totalAmount: bookingTotal,
        }),
      });
      setBookingRef(booking?.reference ?? "");
      setShowMobileModal(false);
      setBookingSuccess(true);
      setMessage(null);
      refreshAvailability(selectedDate);
    } catch (err: any) {
      // If the slot filled up between selection and submit, surface it and
      // refresh availability so the picker greys out the now-full slot.
      setMessage(err.message || "Booking failed.");
      refreshAvailability(selectedDate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="bg-white text-black overflow-x-clip">
      {/* ═══ HERO ═══ */}
      <section className="relative w-full overflow-hidden h-[450px] md:h-screen md:min-h-[600px]">
        <img
          src="/SWIMMING/main-banner.jpg"
          alt="Pool"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.2) 0%,rgba(0,0,0,0) 100%),linear-gradient(rgba(0,0,0,0) 47.9%,rgba(0,0,0,0.8) 100%)",
          }}
        ></div>
        <div className="site-container relative h-full flex flex-col items-start md:items-center justify-end !pb-16 md:!pb-20 text-left md:text-center w-full">

          <img src="/Service-logo/final-out-09.png" alt="Hideaway Swimsuites" className="w-[100px] md:w-[120px] object-contain mb-4" />
          <p className="text-white/90 text-base sm:text-lg lg:text-[20px] leading-[1.3] max-w-xl">
            Enjoy temperature control Ozone Activated Indoor Pool.
          </p>
        </div>
      </section>

      <section className="site-container !pt-16 md:!pt-24 lg:!pt-[120px]   text-center">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[80px] mx-auto items-center">
     
          <div className="relative rounded-[20px] overflow-hidden w-full h-[380px] md:h-[400px] lg:h-[400px]">
            <img
              src="/SWIMMING/main-banner.jpg"
              alt="Hideaway Swimsuite"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

        
          <div className="text-left text-black">
        
      
            <ul className="flex flex-col gap-6 text-base md:text-[25px] lg:text-[25px]">
              <li className="flex items-start gap-3">
                <FaStarOfLife className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-1 text-black/80" />
                <span>2 exclusive private pools</span>
              </li>
              <li className="flex items-start gap-3">
                <FaStarOfLife className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-1 text-black/80" />
                <span>Ozone-based pools</span>
              </li>
              <li className="flex items-start gap-3">
                <FaStarOfLife className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-1 text-black/80" />
                <span>Both pools are equipped with sauna &amp; jacuzzi</span>
              </li>
              <li className="flex items-start gap-3">
                <FaStarOfLife className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-1 text-black/80" />
                <span>Temperature-controlled swimming pools</span>
              </li>
              <li className="flex items-start gap-3">
                <FaStarOfLife className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-1 text-black/80" />
                <span>Enjoy music with a dedicated speaker system</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ BOOK YOUR SESSION (plans + date/time + add-ons with sticky summary) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-6 md:mb-8 lg:mb-10">
          Choose Your Plan
        </h2>
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
          {/* LEFT: booking steps */}
          <div className="flex flex-col gap-10 md:gap-14 min-w-0">
            <div id="pool-plans" className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              {plans.map((plan) => {
            const isSelected = selectedPool === plan.id;
            const hours = Math.floor(plan.durationMinutes / 60);
            const mins = plan.durationMinutes % 60;
            const durationLabel = hours && mins ? `${hours}h ${mins}m` : hours ? `${hours} hour${hours > 1 ? "s" : ""}` : `${mins} min`;
            return (
              <div
                key={plan.id}
                className={`relative rounded-[20px] bg-[#9EF6FD] p-6 md:p-8 flex flex-col gap-4 border-2 transition-colors ${
                  isSelected ? "border-black" : "border-transparent"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                    ✓
                  </span>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold leading-[1.2]">{plan.name}</h3>
                    <p className="text-sm text-black/60 mt-1">{plan.caption}</p>
                  </div>
                  {plan.popular && !isSelected ? (
                    <span className="rounded-[10px] bg-[#e1ff83] px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-black whitespace-nowrap">
                      Most booked
                    </span>
                  ) : (
                    <span className="rounded-[10px] bg-white px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-black whitespace-nowrap">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/75 border border-black/10 px-3 py-1 text-xs font-medium text-black">
                    ⏱ {durationLabel}
                  </span>
                  <span className="rounded-full bg-white/75 border border-black/10 px-3 py-1 text-xs font-medium text-black">
                    {plan.badge}
                  </span>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <FaStarOfLife className="w-3 h-3 flex-shrink-0 mt-1 text-black" />
                      <span className="text-sm font-medium leading-[1.35] text-black">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-baseline gap-1.5 mt-auto">
                  <span className="text-[28px] font-bold leading-none">{inr(plan.price)}</span>
                  <span className="text-sm font-medium text-black/60">/ session</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPool(plan.id);
                    setSelectedSlot(null);
                  }}
                  className="w-full rounded-full bg-black py-3 text-sm font-medium text-white transition-transform active:scale-95 hover:bg-black/85"
                >
                  {isSelected ? "Selected" : `Select ${plan.name}`}
                </button>
              </div>
            );
              })}
            </div>

            {/* Add-ons — individual services, one toggle each */}
            <div className="flex flex-col gap-3">
              <div className="bg-white border border-black/10 rounded-[20px] px-4 py-3.5 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-[#9EF6FD] flex items-center justify-center flex-none">
                    <img src="/ICONS/Jacuzzi.png" alt="" className="w-6 h-6 object-contain" />
                  </span>
                  <div>
                    <p className="font-semibold leading-tight text-black">Jacuzzi</p>
                    <p className="text-sm text-black/55">Individual service · +₹500</p>
                  </div>
                </div>
                <button type="button" role="switch" aria-checked={addons.jacuzzi} aria-label="Add Jacuzzi" onClick={() => setAddons((a) => ({ ...a, jacuzzi: !a.jacuzzi }))} className={`relative w-[52px] h-[30px] rounded-full flex-none transition-colors ${addons.jacuzzi ? "bg-black" : "bg-gray-300"}`}>
                  <span className={`absolute top-[3px] w-6 h-6 rounded-full bg-white shadow transition-all ${addons.jacuzzi ? "left-[25px]" : "left-[3px]"}`} />
                </button>
              </div>
              <div className="bg-white border border-black/10 rounded-[20px] px-4 py-3.5 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-[#9EF6FD] flex items-center justify-center flex-none">
                    <img src="/ICONS/Sauna_Bath.png" alt="" className="w-6 h-6 object-contain" />
                  </span>
                  <div>
                    <p className="font-semibold leading-tight text-black">Sauna Bath</p>
                    <p className="text-sm text-black/55">Individual service · +₹500</p>
                  </div>
                </div>
                <button type="button" role="switch" aria-checked={addons.sauna} aria-label="Add Sauna Bath" onClick={() => setAddons((a) => ({ ...a, sauna: !a.sauna }))} className={`relative w-[52px] h-[30px] rounded-full flex-none transition-colors ${addons.sauna ? "bg-black" : "bg-gray-300"}`}>
                  <span className={`absolute top-[3px] w-6 h-6 rounded-full bg-white shadow transition-all ${addons.sauna ? "left-[25px]" : "left-[3px]"}`} />
                </button>
              </div>
            </div>

            {/* Date & time */}
            <div id="pool-datetime" className="bg-[#e3fdff] border border-[#77f4ff] rounded-[24px] md:rounded-[30px] px-5 sm:px-8 py-6 md:py-7 scroll-mt-24">
              <h3 className="text-xl md:text-2xl font-semibold mb-1">Choose date &amp; time</h3>
              <p className="text-sm text-black/60 mb-5">
                Only 2 pools are available — each slot takes up to 2 bookings (one per pool). We&rsquo;ll confirm your pool at booking.
              </p>

              <p className="text-sm font-semibold mb-3">Date</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dateOptions.map((o) => (
                  <button
                    key={o.iso}
                    type="button"
                    onClick={() => setSelectedDate(o.iso)}
                    aria-pressed={selectedDate === o.iso}
                    className={`flex-none min-w-[62px] text-center rounded-[14px] px-3 py-2 border transition-colors ${selectedDate === o.iso ? "bg-black text-white border-black" : "bg-white border-black/15 hover:border-black/40"}`}
                  >
                    <span className={`block text-[11px] uppercase tracking-wide ${selectedDate === o.iso ? "text-white/80" : "text-black/50"}`}>{o.dow}</span>
                    <span className="block text-lg font-bold">{o.dnum}</span>
                  </button>
                ))}
              </div>

              <p className="text-sm font-semibold mt-6 mb-1">Available times</p>
              <p className="text-xs text-black/55 mb-3">
                {selectedPlan ? "Times reflect your plan's session length." : "Select a plan above to see time slots for its duration."}
              </p>
              <PoolTimeSlots
                durationMinutes={selectedPlan?.durationMinutes ?? 90}
                occupied={poolOccupied}
                capacity={poolCapacity}
                onSlotChange={setSelectedSlot}
              />
            </div>

            {/* Key policies */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="bg-[#e3fdff] border border-black/5 rounded-[16px] p-4 flex gap-3">
                <span className="text-lg">⏱</span>
                <div><p className="font-semibold text-sm text-black">Overtime ₹500 / 10 min</p><p className="text-xs text-black/60">After your slot ends</p></div>
              </div>
              <div className="bg-[#e3fdff] border border-black/5 rounded-[16px] p-4 flex gap-3">
                <span className="text-lg">🚫</span>
                <div><p className="font-semibold text-sm text-black">No refunds</p><p className="text-xs text-black/60">Private booking — non-cancellable</p></div>
              </div>
              <div className="bg-[#e3fdff] border border-black/5 rounded-[16px] p-4 flex gap-3">
                <span className="text-lg">👶</span>
                <div><p className="font-semibold text-sm text-black">Kids supervised</p><p className="text-xs text-black/60">Under 12 with an adult · under 3 not allowed</p></div>
              </div>
            </div>
          </div>

          {/* RIGHT: sticky booking summary */}
          <aside className="lg:sticky lg:top-24 self-start bg-white border border-black/10 rounded-[20px] overflow-hidden shadow-md">
            <div className="bg-[#9EF6FD] px-6 py-5">
              <p className="text-lg font-semibold text-black">Your booking</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3.5 text-sm">
              <div className="flex justify-between gap-3"><span className="text-black/60">Plan</span><span className={selectedPlan ? "font-semibold text-right" : "text-black/40"}>{selectedPlan?.name ?? "—"}</span></div>
              <div className="flex justify-between gap-3"><span className="text-black/60">Capacity &amp; time</span><span className={selectedPlan ? "font-semibold text-right" : "text-black/40 text-right"}>{selectedPlan ? `${selectedPlan.badge} · ${durationText(selectedPlan.durationMinutes)}` : "Select a plan"}</span></div>
              <div className="flex justify-between gap-3"><span className="text-black/60">Date</span><span className={selectedDate ? "font-semibold text-right" : "text-black/40"}>{selectedDate || "—"}</span></div>
              <div className="flex justify-between gap-3"><span className="text-black/60">Time slot</span><span className={selectedSlot ? "font-semibold text-right" : "text-black/40 text-right"}>{selectedSlot ? `${selectedSlot.start} – ${selectedSlot.end}` : "—"}</span></div>
              <div className="h-px bg-black/10" />
              <div className="flex justify-between gap-3"><span className="text-black/60">Session</span><span className="font-semibold">{inr(selectedPlan?.price ?? 0)}</span></div>
              <div className="flex justify-between gap-3"><span className="text-black/60">Jacuzzi</span><span className={addons.jacuzzi ? "font-semibold" : "text-black/40"}>{addons.jacuzzi ? `+ ${inr(500)}` : "Not added"}</span></div>
              <div className="flex justify-between gap-3"><span className="text-black/60">Sauna Bath</span><span className={addons.sauna ? "font-semibold" : "text-black/40"}>{addons.sauna ? `+ ${inr(500)}` : "Not added"}</span></div>
              <div className="h-px bg-black/10" />
              <div className="flex justify-between items-baseline"><span className="text-black/60 uppercase tracking-wide text-xs">Total</span><span className="text-2xl font-bold text-black">{inr(bookingTotal)}</span></div>
            </div>
            <div className="px-6 pb-5">
              {message && !showMobileModal && (
                <p className="mb-3 text-sm text-rose-600">{message}</p>
              )}
              {bookingSuccess && (
                <div className="mb-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                  <p className="text-sm text-green-700 font-medium">Booking confirmed! We&rsquo;ll see you at the pool.</p>
                  {bookingRef && (
                    <p className="text-sm text-green-800 mt-1">Your booking ID: <span className="font-bold tracking-wide">{bookingRef}</span></p>
                  )}
                </div>
              )}
              <button type="button" onClick={handleConfirmBooking} className="w-full bg-black text-white rounded-full py-3.5 font-medium hover:bg-black/85 transition-transform active:scale-95">
                Confirm Booking
              </button>
              <p className="mt-3 text-xs text-black/55">Accept the policies below, then confirm your details to book.</p>
            </div>
          </aside>
        </div>
      </section>

      {/* ═══ POLICIES & CONFIRMATION (Standard Padding) ═══ */}
      <section id="pool-policies" className="site-container scroll-mt-24">
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.2] mb-6 md:mb-8">
          Policies &amp; Confirmation
        </h2>
        <div className="bg-[#e3fdff] rounded-[24px] md:rounded-[30px] px-5 sm:px-8 lg:px-12 py-6 md:py-10 flex flex-col gap-6 md:gap-8">
          {/* Policy 1: Dress Code */}
          <label className="flex items-start gap-3 md:gap-5 cursor-pointer group">
            <input
              type="checkbox"
              checked={policies.dressCode}
              onChange={(e) => setPolicies((p) => ({ ...p, dressCode: e.target.checked }))}
              className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1 rounded border-gray-400 text-black focus:ring-black accent-black cursor-pointer"
            />
            <div>
              <p className="text-xl md:text-[24px] font-medium leading-[1.2] text-black mb-1.5 md:mb-2 group-hover:text-black/80 transition-colors">
                Dress Code Acceptance
              </p>
              <p className="text-base md:text-[18px] text-black/80 leading-[1.3]">
                Appropriate swimwear is required. No denim, shoes, or street
                clothing in pool areas.
              </p>
            </div>
          </label>

          {/* Policy 2: Kids & Supervision Policy */}
          <label className="flex items-start gap-3 md:gap-5 cursor-pointer group">
            <input
              type="checkbox"
              checked={policies.kids}
              onChange={(e) => setPolicies((p) => ({ ...p, kids: e.target.checked }))}
              className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1 rounded border-gray-400 text-black focus:ring-black accent-black cursor-pointer"
            />
            <div>
              <p className="text-xl md:text-[24px] font-medium leading-[1.2] text-black mb-1.5 md:mb-2 group-hover:text-black/80 transition-colors">
                Kids & Supervision Policy
              </p>
              <div className="text-base md:text-[18px] text-black/80 leading-[1.3]">
                <p className="mb-1">Children aged 3 to 12 years must be accompanied and supervised by a parent or guardian at all times. The management will not be responsible for any accidents, injuries, or incidents resulting from unsupervised activities.</p>

              </div>
            </div>
          </label>

          {/* Policy 3: Terms & Conditions & Safety Waiver */}
          <label className="flex items-start gap-3 md:gap-5 cursor-pointer group">
            <input
              type="checkbox"
              checked={policies.terms}
              onChange={(e) => setPolicies((p) => ({ ...p, terms: e.target.checked }))}
              className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1 rounded border-gray-400 text-black focus:ring-black accent-black cursor-pointer"
            />
            <div>
              <p className="text-xl md:text-[24px] font-medium leading-[1.2] text-black mb-1.5 md:mb-2 group-hover:text-black/80 transition-colors">
                Terms &amp; Conditions &amp; Safety Waiver
              </p>
              <p className="text-base md:text-[18px] text-black/80 leading-[1.3]">
                I have read and agree to the Terms &amp; Conditions and safety waiver of Hideaway Swimsuites below.
              </p>
            </div>
          </label>

          {/* Full terms — scrollable */}
          <div className="max-h-[280px] overflow-y-auto rounded-[16px] bg-white/70 border border-black/10 px-5 py-4">
            <ol className="list-decimal pl-5 flex flex-col gap-3 text-sm md:text-[15px] text-black/80 leading-[1.45]">
              <li><strong className="text-black">Pool Access.</strong> Use is restricted to registered guests, members or authorised users only. Operating hours and booking schedules must be followed.</li>
              <li><strong className="text-black">Private Booking.</strong> The pool is reserved exclusively for you for the booked slot — cancellation, rescheduling or refund is not possible under any circumstances.</li>
              <li><strong className="text-black">Duration &amp; Extra Charges.</strong> An extra ₹500 applies for every additional 10 minutes after your slot ends. Jacuzzi, sauna and other facilities are charged separately.</li>
              <li><strong className="text-black">Health &amp; Safety.</strong> Guests with contagious illness, open wounds, skin infections or epilepsy should not use the pool. Showering before entry is mandatory. No running, diving in shallow areas or rough play.</li>
              <li><strong className="text-black">Children &amp; Supervision.</strong> Under-12s must be supervised by an adult at all times. Children below 3 years are not allowed. Parents/guardians are fully responsible for minors.</li>
              <li><strong className="text-black">Swimming Ability &amp; Emergencies.</strong> For group/family bookings, at least one adult must be able to swim and perform CPR. Life jackets are advised for non-swimmers and children.</li>
              <li><strong className="text-black">Proper Swimwear.</strong> Proper attire required; cotton clothing, jeans or unsuitable attire are not allowed.</li>
              <li><strong className="text-black">Hygiene.</strong> Shower before entry. Ladies during menstruation are requested not to use the pool. No spitting, urinating or contaminating the water. Pets not allowed unless permitted.</li>
              <li><strong className="text-black">Food &amp; Beverages.</strong> No glass bottles, alcohol or outside food. Food may be ordered from Promenade Café. Dispose of waste properly.</li>
              <li><strong className="text-black">Use at Own Risk.</strong> This is a private facility used at your own risk. Management is not responsible for accidents, injuries, drowning, or loss/damage of belongings.</li>
              <li><strong className="text-black">Emergencies.</strong> Press the emergency button and call 100/101, or proceed to Amala Hospital.</li>
              <li><strong className="text-black">Damage &amp; Liability.</strong> Damage to pool property or equipment is charged to the responsible guest. Staff may enter the pool area when necessary.</li>
              <li><strong className="text-black">Weather &amp; Maintenance.</strong> Management may temporarily close the pool for maintenance or safety without prior notice.</li>
              <li><strong className="text-black">Noise &amp; Conduct.</strong> No loud music, abusive language or disruptive conduct. Maximum liability for any dispute is limited to 70% of the amount paid. Management is not responsible for loss/theft of belongings.</li>
              <li><strong className="text-black">Right to Refuse Access.</strong> Management may deny entry or remove anyone violating the rules.</li>
              <li><strong className="text-black">Agreement.</strong> By booking you confirm that you have read, understood and agree to these Terms &amp; Conditions and the safety waiver.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* ═══ A SANCTUARY OF SERENITY (Alternating Section 3 - 120px Padding) ═══ */}
      <section className="site-container !py-16 md:!py-24 lg:!py-[120px]">
        <div className="flex flex-col items-center text-center mb-8 md:mb-10">
      
          <h2 className="text-3xl md:text-4xl lg:text-[60px] font-normal leading-[1.2]">
            A Sanctuary of Serenity
          </h2>
        </div>
        {/* Gallery Row 1: large left + smaller right */}
        <div className="grid grid-cols-1 md:grid-cols-[5fr_3fr] gap-3 md:gap-4 mb-3 md:mb-4">
          <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[260px] md:h-[350px] lg:h-[484px]">
            <Image
              src="/SWIMMING/swimming_gallery_1.webp"
              alt="Gallery 1"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[260px] md:h-[350px] lg:h-[484px]">
            <Image
              src="/SWIMMING/swimming_gallery_2.webp"
              alt="Gallery 2"
              fill
              className="object-cover"
            />
          </div>
        </div>
        {/* Gallery Row 2: 4 equal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[180px] md:h-[250px] lg:h-[300px]">
            <Image
              src="/SWIMMING/swimming_gallery_3.webp"
              alt="Gallery 3"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[180px] md:h-[250px] lg:h-[300px]">
            <Image
              src="/SWIMMING/swimming_gallery_4.webp"
              alt="Gallery 4"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[180px] md:h-[250px] lg:h-[300px]">
            <Image
              src="/SWIMMING/swimming_gallery_5.webp"
              alt="Gallery 5"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative rounded-[16px] md:rounded-[20px] overflow-hidden h-[180px] md:h-[250px] lg:h-[300px]">
            <Image
              src="/SWIMMING/swimming_gallery_6.webp"
              alt="Gallery 6"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>

      {/* ═══ DETAILS MODAL ═══ */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-[360px] shadow-2xl">
            <h3 className="text-xl font-semibold mb-1">Enter your details</h3>
            <p className="text-sm text-black/50 mb-5">We&rsquo;ll use these to confirm your pool booking.</p>
            <input
              type="text"
              className="w-full border border-black/20 rounded-xl px-4 py-3 text-base mb-3 focus:outline-none focus:ring-2 focus:ring-black/30"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your name"
            />
            <input
              type="tel"
              maxLength={10}
              className="w-full border border-black/20 rounded-xl px-4 py-3 text-base mb-3 focus:outline-none focus:ring-2 focus:ring-black/30"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              placeholder="Mobile number (e.g. 9876543210)"
            />
            <input
              type="email"
              className="w-full border border-black/20 rounded-xl px-4 py-3 text-base mb-4 focus:outline-none focus:ring-2 focus:ring-black/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
            />
            {message && <p className="text-rose-600 text-sm mb-3">{message}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowMobileModal(false); setMessage(null); }}
                className="flex-1 border border-black/20 rounded-full py-3 text-sm font-medium hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceBooking}
                disabled={loading}
                className="flex-1 bg-black text-white rounded-full py-3 text-sm font-medium hover:bg-black/80 transition-colors disabled:opacity-60"
              >
                {loading ? "Booking…" : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
