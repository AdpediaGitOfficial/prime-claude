"use client";

import { useState } from "react";

// generate hourly slots between startHour and endHour (inclusive)
const generateSlots = (startHour24: number, endHour24: number) => {
  const out: { time: string; ampm: string; period: string }[] = [];
  for (let h = startHour24; h <= endHour24; h++) {
    const hour12 = ((h + 11) % 12) + 1; // convert 24h to 12h (1-12)
    const ampm = h < 12 ? "am" : "pm";
    let period = "afternoon";
    if (h < 12) period = "morning";
    else if (h >= 17) period = "evening";
    else if (h === 12) period = "midday";

    out.push({ time: `${hour12}:00`, ampm, period });
  }
  return out;
};

const slots = generateSlots(10, 21); // 10:00 to 21:00 hourly

export default function SpaTimeSlots({ onSlotChange }: { onSlotChange?: (time: string) => void }) {
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  return (
    <>
      <p className="text-[22px] capitalize leading-[1.2] mb-5">Available Slots</p>
      {/* split slots into two roughly equal rows */}
      {(() => {
        const half = Math.ceil(slots.length / 2);
        const first = slots.slice(0, half);
        const second = slots.slice(half);
        return (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
              {first.map((slot, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    setActiveSlot(i);
                    onSlotChange?.(`${slot.time} ${slot.ampm}`);
                  }}
                  className={`rounded-[20px] flex flex-col items-center justify-center gap-3 py-6 ${activeSlot === i ? "bg-black text-white" : "bg-white text-black"}`}
                >
                  <span className="text-[22px] font-semibold leading-[1.2]">
                    {slot.time} <span className="lowercase">{slot.ampm}</span>
                  </span>
                  <span className="text-[20px] leading-[1.2] capitalize">{slot.period}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {second.map((slot, i) => {
                const idx = i + half;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setActiveSlot(idx);
                      onSlotChange?.(`${slot.time} ${slot.ampm}`);
                    }}
                    className={`rounded-[20px] flex flex-col items-center justify-center gap-3 py-6 ${activeSlot === idx ? "bg-black text-white" : "bg-white text-black"}`}
                  >
                    <span className="text-[22px] font-semibold leading-[1.2]">
                      {slot.time} <span className="lowercase">{slot.ampm}</span>
                    </span>
                    <span className="text-[20px] leading-[1.2] capitalize">{slot.period}</span>
                  </button>
                );
              })}
            </div>
          </>
        );
      })()}
    </>
  );
}
