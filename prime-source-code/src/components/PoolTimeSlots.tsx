"use client";

import { useEffect, useMemo, useState } from "react";

export type Slot = { start: string; end: string };

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
    out.push({ start: formatMins(cur), end: formatMins(next) });
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

export default function PoolTimeSlots({
  durationMinutes = 90,
  onSlotChange,
}: {
  durationMinutes?: number;
  onSlotChange?: (slot: Slot) => void;
}) {
  const slots = useMemo(() => generateSlots("10:00", "22:00", durationMinutes), [durationMinutes]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const label = durationLabel(durationMinutes);

  // When the plan (and therefore slot length) changes, clear any prior selection
  // so the parent never keeps a slot that no longer exists.
  useEffect(() => {
    setActiveSlot(null);
  }, [durationMinutes]);

  const handleSelect = (index: number) => {
    setActiveSlot(index);
    onSlotChange?.(slots[index]);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {slots.map((slot, index) => (
        <button
          key={`${slot.start}-${slot.end}`}
          type="button"
          onClick={() => handleSelect(index)}
          aria-pressed={activeSlot === index}
          className={`w-full text-left rounded-lg px-4 py-3 text-sm transition-all border ${
            activeSlot === index
              ? "bg-black text-white border-black"
              : "border-black/20 hover:bg-[#cff9ff]"
          }`}
        >
          <div className={`font-medium ${activeSlot === index ? "text-white" : "text-black"}`}>
            {slot.start}
          </div>
          <div className={`text-xs ${activeSlot === index ? "text-white/80" : "text-black/60"}`}>
            to {slot.end}
          </div>
          <div className={`text-[11px] mt-1 ${activeSlot === index ? "text-white/80" : "text-black/70"}`}>
            Session • {label}
          </div>
        </button>
      ))}
    </div>
  );
}
