"use client";
import { useState } from "react";
import { FiCalendar } from "react-icons/fi";

export default function DatePicker({ onDateChange }: { onDateChange?: (date: string) => void }) {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const formatDDMMYYYY = (isoDate: string) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  return (
    <div>
      <div className="bg-white border border-[#77f4ff] rounded-[16px] md:rounded-[20px] flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 w-full max-w-[280px] md:max-w-xs hover:bg-gray-50 transition-colors">
        <FiCalendar className="w-5 h-5 text-black/60 flex-shrink-0" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            onDateChange?.(e.target.value);
          }}
          className="bg-transparent text-base md:text-xl text-black/60 outline-none flex-1"
        />
      </div>
      {/* Display formatted date below the input for consistent dd-mm-yyyy appearance */}
      <div className="mt-2 text-sm md:text-base text-black/60">
        {selectedDate ? formatDDMMYYYY(selectedDate) : ""}
      </div>
    </div>
  );
}
