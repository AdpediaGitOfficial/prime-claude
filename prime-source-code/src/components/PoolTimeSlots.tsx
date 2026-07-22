"use client";

import { useEffect, useMemo, useState } from "react";

export type Slot = { start: string; end: string; startMin: number; endMin: number };
export type Interval = { start: number; end: number };

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map((v) => parseInt(v, 10));
  return h * 60 + (isNaN(m) ? 0 : m);
};

const formatMins = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
};

const generateSlots = (startStr = "10:00", endStr = "22:00", durationMinutes = 90): Slot[] => {
  const start = toMinutes(startStr);
  const end = toMinutes(endStr);
  const out: Slot[] = [];
  let cur = start;
  while (cur + durationMinutes <= end) {
    const next = cur + durationMinutes;
    out.push({ start: formatMins(cur), end: formatMins(next), startMin: cur, endMin: next });
    cur = next;
  }
  return out;
};

const durationLabel = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

/**
 * Busiest number of `existing` intervals overlapping at any instant inside
 * `win`. Touching intervals (one ends when another starts) don't count.
 */
const busiestWithin = (existing: Interval[], win: Interval): number => {
  const events: Array<[number, number]> = [];
  for (const iv of existing) {
    const s = Math.max(iv.start, win.start);
    const e = Math.min(iv.end, win.end);
    if (s < e) {
      events.push([s, 1]);
      events.push([e, -1]);
    }
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let cur = 0;
  let max = 0;
  for (const [, delta] of events) {
    cur += delta;
    if (cur > max) max = cur;
  }
  return max;
};

export default function PoolTimeSlots({
  durationMinutes = 90,
  occupied = [],
  capacity = 2,
  onSlotChange,
}: {
  durationMinutes?: number;
  occupied?: Interval[];
  capacity?: number;
  onSlotChange?: (slot: Slot | null) => void;
}) {
  const slots = useMemo(() => generateSlots("10:00", "22:00", durationMinutes), [durationMinutes]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const label = durationLabel(durationMinutes);

  // Free pools per slot = capacity − busiest overlapping booking count.
  const freeBySlot = useMemo(
    () =>
      slots.map((slot) =>
        Math.max(0, capacity - busiestWithin(occupied, { start: slot.startMin, end: slot.endMin }))
      ),
    [slots, occupied, capacity]
  );

  // Clear the selection whenever the slot grid changes (plan switch) or the
  // currently-selected slot becomes fully booked (availability refresh).
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
    if (freeBySlot[index] <= 0) return; // fully booked — not selectable
    setActiveSlot(index);
    onSlotChange?.(slots[index]);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {slots.map((slot, index) => {
        const free = freeBySlot[index];
        const isActive = activeSlot === index;
        const isFull = free <= 0;
        const availText = isFull
          ? "Fully booked"
          : free === 1
          ? "1 pool left"
          : `${free} pools available`;
        const availClass = isFull
          ? "text-red-600"
          : free === 1
          ? "text-amber-600"
          : "text-emerald-600";
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
            <div
              className={`font-medium ${
                isActive ? "text-white" : isFull ? "text-black/40" : "text-black"
              }`}
            >
              {slot.start}
            </div>
            <div
              className={`text-xs ${
                isActive ? "text-white/80" : isFull ? "text-black/35" : "text-black/60"
              }`}
            >
              to {slot.end}
            </div>
            <div
              className={`text-[11px] mt-1 font-medium no-underline ${
                isActive ? "text-white/90" : availClass
              }`}
            >
              {availText}
            </div>
          </button>
        );
      })}
    </div>
  );
}
