"use client";

import { apiCall, ENDPOINTS } from "@/utils/api";
import { useFormSubmit } from "@/utils/useFormSubmit";
import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

const TOTAL_COUNTERS = 30;

/**
 * Counters that are already taken. There is no availability endpoint yet, so
 * this stays empty and every counter is selectable. When the backend can
 * report booked counters, populate this set (e.g. from a fetch) and the
 * "booked" styling / legend below light up automatically.
 */
const BOOKED_COUNTERS = new Set<number>();

const VENDOR_TYPES = [
  "Fashion",
  "Food & Beverage",
  "Health & Wellness",
  "Retail Products",
];

const DURATIONS = ["1 Week", "1 Month", "1 Year"];

type EnquiryForm = {
  fullName: string;
  phone: string;
  email: string;
  organisationName: string;
  vendorType: string;
  duration: string;
};

const initialFormData: EnquiryForm = {
  fullName: "",
  phone: "",
  email: "",
  organisationName: "",
  vendorType: "",
  duration: "",
};

const counterLabel = (n: number) => `Counter ${String(n).padStart(2, "0")}`;

export default function VendorCounters() {
  const [selected, setSelected] = useState<number[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [formData, setFormData] = useState<EnquiryForm>(initialFormData);
  const { isSubmitting, submitMessage, submitError, runSubmit } = useFormSubmit();

  const counters = useMemo(
    () => Array.from({ length: TOTAL_COUNTERS }, (_, i) => i + 1),
    []
  );
  const availableCount = TOTAL_COUNTERS - BOOKED_COUNTERS.size;
  const hasBooked = BOOKED_COUNTERS.size > 0;

  const visibleCounters = useMemo(
    () =>
      onlyAvailable
        ? counters.filter((n) => !BOOKED_COUNTERS.has(n))
        : counters,
    [counters, onlyAvailable]
  );

  const toggleCounter = (n: number) => {
    if (BOOKED_COUNTERS.has(n)) return;
    setSelected((current) =>
      current.includes(n)
        ? current.filter((x) => x !== n)
        : [...current, n].sort((a, b) => a - b)
    );
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const scrollToPanel = () => {
    document
      .getElementById("vendor-enquiry")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selected.length === 0) {
      scrollToGrid();
      return;
    }

    const chosen = selected.map(counterLabel);

    runSubmit(
      async () => {
        await apiCall(ENDPOINTS.VENDOR_INVITES, {
          method: "POST",
          body: JSON.stringify({
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            organisationName: formData.organisationName,
            vendorType: formData.vendorType,
            counters: chosen,
            preferredDuration: formData.duration,
            additionalRequirements: `Interested counters: ${chosen.join(
              ", "
            )}. Preferred booking duration: ${formData.duration}.`,
            termsAccepted: true,
          }),
        });
        setSelected([]);
        setFormData(initialFormData);
      },
      "Enquiry sent successfully. Our team will confirm availability and get back to you.",
      "Failed to send enquiry. Please try again."
    );
  };

  const scrollToGrid = () => {
    document
      .getElementById("vendor-counter-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">
      {/* ── Counters column ── */}
      <div>
        {/* Availability + filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <p className="text-base md:text-lg text-black/70">
            <span className="font-semibold text-black">{availableCount}</span> of{" "}
            {TOTAL_COUNTERS} counters available
          </p>
          {hasBooked && (
            <label className="flex items-center gap-2 text-base text-black/70 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 accent-[#ec6824]"
              />
              Show only available
            </label>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 text-sm text-black/70">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md border border-black/10" style={{ background: "#fdf0e9" }} />
            Available
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md" style={{ background: "#ec6824" }} />
            Selected
          </span>
          {hasBooked && (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-md bg-black/10" />
              Booked
            </span>
          )}
        </div>

        {/* Counter grid */}
        <div
          id="vendor-counter-grid"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 scroll-mt-24"
        >
          {visibleCounters.map((n) => {
            const isBooked = BOOKED_COUNTERS.has(n);
            const isSelected = selected.includes(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggleCounter(n)}
                disabled={isBooked}
                aria-pressed={isSelected}
                aria-label={`${counterLabel(n)}${
                  isBooked ? " (booked)" : isSelected ? " (selected)" : " (available)"
                }`}
                className={`relative rounded-2xl p-4 min-h-[92px] flex flex-col items-start justify-center gap-1 text-left transition-all ${
                  isBooked
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
                } ${
                  isSelected ? "ring-2 ring-[#ec6824] shadow-md" : "ring-1 ring-black/5"
                }`}
                style={{
                  background: isBooked
                    ? "#f1f1f1"
                    : isSelected
                    ? "#ec6824"
                    : "#fdf0e9",
                }}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-[#ec6824] flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                )}
                <span
                  className={`text-base md:text-lg font-semibold leading-tight ${
                    isSelected ? "text-white" : "text-black"
                  }`}
                >
                  {counterLabel(n)}
                </span>
                <span
                  className={`text-xs md:text-sm ${
                    isBooked
                      ? "text-black/50"
                      : isSelected
                      ? "text-white/90"
                      : "text-black/60"
                  }`}
                >
                  {isBooked ? "Booked" : isSelected ? "Selected" : "Available"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Sticky enquiry panel ── */}
      <aside
        id="vendor-enquiry"
        className="lg:sticky lg:top-24 rounded-[24px] overflow-hidden shadow-sm scroll-mt-24"
        style={{ background: "#fdf0e9" }}
      >
        <div className="px-5 py-4" style={{ background: "#ec6824" }}>
          <p className="text-lg md:text-xl font-semibold text-white leading-tight">
            Your enquiry
          </p>
          <p className="text-sm text-white/85">
            Select counters, then send one enquiry
          </p>
        </div>

        <div className="p-5">
          {/* Selected counters */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-black/60">Selected counters</span>
            <span className="text-sm font-semibold text-black">
              {selected.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4 min-h-[28px]">
            {selected.length === 0 ? (
              <span className="text-sm text-black/45">None selected yet</span>
            ) : (
              selected.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => toggleCounter(n)}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-black hover:bg-white/70 transition-colors"
                  aria-label={`Remove ${counterLabel(n)}`}
                >
                  {counterLabel(n)}
                  <span className="text-black/45">✕</span>
                </button>
              ))
            )}
          </div>

          <div className="h-px bg-black/10 mb-4" />

          {/* Enquiry form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label htmlFor="v-name" className="block text-sm font-medium mb-1">
                Full name*
              </label>
              <input
                id="v-name"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="w-full bg-white rounded-xl px-4 h-11 text-base outline-none focus:ring-2 focus:ring-[#ec6824]/40"
              />
            </div>
            <div>
              <label htmlFor="v-phone" className="block text-sm font-medium mb-1">
                Phone number*
              </label>
              <input
                id="v-phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full bg-white rounded-xl px-4 h-11 text-base outline-none focus:ring-2 focus:ring-[#ec6824]/40"
              />
            </div>
            <div>
              <label htmlFor="v-email" className="block text-sm font-medium mb-1">
                Email address*
              </label>
              <input
                id="v-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full bg-white rounded-xl px-4 h-11 text-base outline-none focus:ring-2 focus:ring-[#ec6824]/40"
              />
            </div>
            <div>
              <label htmlFor="v-org" className="block text-sm font-medium mb-1">
                Business / brand name*
              </label>
              <input
                id="v-org"
                name="organisationName"
                type="text"
                required
                value={formData.organisationName}
                onChange={handleInputChange}
                placeholder="Your brand name"
                className="w-full bg-white rounded-xl px-4 h-11 text-base outline-none focus:ring-2 focus:ring-[#ec6824]/40"
              />
            </div>
            <div>
              <label htmlFor="v-type" className="block text-sm font-medium mb-1">
                Vendor type*
              </label>
              <select
                id="v-type"
                name="vendorType"
                required
                value={formData.vendorType}
                onChange={handleInputChange}
                className="w-full bg-white rounded-xl px-4 h-11 text-base outline-none focus:ring-2 focus:ring-[#ec6824]/40 cursor-pointer"
              >
                <option value="">Select type</option>
                {VENDOR_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="v-duration" className="block text-sm font-medium mb-1">
                Preferred booking duration*
              </label>
              <select
                id="v-duration"
                name="duration"
                required
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full bg-white rounded-xl px-4 h-11 text-base outline-none focus:ring-2 focus:ring-[#ec6824]/40 cursor-pointer"
              >
                <option value="">Select duration</option>
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {submitMessage && (
              <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                {submitMessage}
              </p>
            )}
            {submitError && (
              <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 bg-black text-white rounded-full w-full h-12 flex items-center justify-center font-medium text-base transition-transform active:scale-95 disabled:opacity-60"
            >
              {isSubmitting
                ? "Sending…"
                : selected.length === 0
                ? "Select a counter to enquire"
                : `Send enquiry · ${selected.length} counter${
                    selected.length > 1 ? "s" : ""
                  }`}
            </button>
            <p className="text-xs text-black/55 text-center">
              We&apos;ll confirm counter availability and get back to you. No
              payment is taken online.
            </p>
          </form>
        </div>
      </aside>
    </div>
  );
}
