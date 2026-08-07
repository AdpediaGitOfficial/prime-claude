"use client";

import { useEffect, useMemo, useState } from "react";

export type Slot = { start: string; end: string; startMin: number; endMin: number };
export type Interval = { start: number; end: number };

const OPEN = 600;   // 10:00 AM
const CLOSE = 1320; // 10:00 PM

const formatMins = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
};

/**
 * Flexible start times every 30 minutes from 10:00 AM; each booking runs
 * start → start+duration and must end by 10:00 PM. 30 min is the finest grid
 * all plan lengths (60/90/180) align to, so it offers every real start
 * (e.g. a Group can begin 11:00 → 2:00) without unsellable slivers.
 */
const generateSlots = (durationMinutes: number): Slot[] => {
  const out: Slot[] = [];
  for (let cur = OPEN; cur + durationMinutes <= CLOSE; cur += 30) {
    out.push({
      start: formatMins(cur),
      end: formatMins(cur + durationMinutes),
      startMin: cur,
      endMin: cur + durationMinutes,
    });
  }
  return out;
};


const busy = (ivs: Interval[], win: Interval) =>
  ivs.some((iv) => iv.start < win.end && iv.end > win.start);

export default function PoolTimeSlots({
  durationMinutes = 90,
  pool1 = [],
  pool2 = [],
  groupPlan = false,
  onSlotChange,
}: {
  durationMinutes?: number;
  pool1?: Interval[];
  pool2?: Interval[];
  groupPlan?: boolean;
  onSlotChange?: (slot: Slot | null) => void;
}) {
  const slots = useMemo(() => generateSlots(durationMinutes), [durationMinutes]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  // Free pools for each slot, honouring the pool roles:
  //   Group  → only Pool 2 counts (0 or 1).
  //   Others → Pool 1 preferred, Pool 2 overflow (0, 1 or 2).
  const freeBySlot = useMemo(
    () =>
      slots.map((s) => {
        const win = { start: s.startMin, end: s.endMin };
        const p1Free = !busy(pool1, win);
        const p2Free = !busy(pool2, win);
        return groupPlan ? (p2Free ? 1 : 0) : (p1Free ? 1 : 0) + (p2Free ? 1 : 0);
      }),
    [slots, pool1, pool2, groupPlan]
  );

  useEffect(() => {
    setActiveSlot(null);
    onSlotChange?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMinutes]);

  useEffect(() => {
    if (activeSlot !== null && freeBySlot[activeSlot] <= 0) {
      setActiveSlot(null);
      onSlotChange?.(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeBySlot]);

  const handleSelect = (index: number) => {
    if (freeBySlot[index] <= 0) return;
    setActiveSlot(index);
    onSlotChange?.(slots[index]);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {slots.map((slot, index) => {
        const free = freeBySlot[index];
        const isActive = activeSlot === index;
        const isFull = free <= 0;
        // Group shows Available / Fully booked (no "1 pool left").
        const availText = isFull
          ? "Fully booked"
          : groupPlan
          ? "Available"
          : free === 1
          ? "1 pool left"
          : "2 pools available";
        const availClass = isFull ? "text-red-600" : free === 1 && !groupPlan ? "text-amber-600" : "text-emerald-600";
        return (
          <button
            key={`${slot.start}-${slot.end}`}
            type="button"
            onClick={() => handleSelect(index)}
            disabled={isFull}
            aria-pressed={isActive}
            aria-disabled={isFull}
            className={`w-full text-left rounded-lg px-4 py-3 text-sm transition-all border ${
              isActive
                ? "bg-black text-white border-black"
                : isFull
                ? "border-black/10 bg-black/[0.04] text-black/40 cursor-not-allowed line-through decoration-black/30"
                : "border-black/20 hover:bg-[#cff9ff]"
            }`}
          >
            <div className={`font-medium ${isActive ? "text-white" : isFull ? "text-black/40" : "text-black"}`}>
              {slot.start}
            </div>
            <div className={`text-xs ${isActive ? "text-white/80" : isFull ? "text-black/35" : "text-black/60"}`}>
              to {slot.end}
            </div>
            <div className={`text-[11px] mt-1 font-medium no-underline ${isActive ? "text-white/90" : availClass}`}>
              {availText}
            </div>
          </button>
        );
      })}
    </div>
  );
}
