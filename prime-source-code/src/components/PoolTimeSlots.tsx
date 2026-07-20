"use client";

import { useState } from "react";

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
  while (cur < end) {
    const next = cur + durationMinutes;
    out.push({ start: formatMins(cur), end: formatMins(next) });
    cur = next;
  }
  return out;
};

const slots = generateSlots();

export default function PoolTimeSlots({
  poolType,
  onSlotChange,
}: {
  poolType?: "private" | "group" | "single";
  onSlotChange?: (slot: Slot) => void;
}) {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setActiveSlot(index);
    onSlotChange?.(slots[index]);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {slots.map((slot, index) => (
        <button
          key={index}
          onClick={() => handleSelect(index)}
          aria-pressed={activeSlot === index}
          className={`w-full text-left rounded-lg px-4 py-3 text-sm transition-all border ${
            activeSlot === index
              ? "bg-black text-white border-black"
              : "border-black/20 hover:bg-black/5"
          }`}
        >
          <div className={`font-medium ${activeSlot === index ? "text-white" : "text-black"}`}>
            {slot.start}
          </div>
          <div className={`text-xs ${activeSlot === index ? "text-white/80" : "text-black/60"}`}>
            {slot.end}
          </div>
          <div className={`text-[11px] mt-1 ${activeSlot === index ? "text-white/80" : "text-black/70"}`}>
            Session • 1h 30m
          </div>
        </button>
      ))}
    </div>
  );
}
