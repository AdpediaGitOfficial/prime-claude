"use client";

import ResourceTable, { type ResourceConfig, type RowRecord } from "@/components/ResourceTable";
import { inr, relativeDate } from "@/lib/format";

const s = (row: RowRecord, key: string) => (row[key] == null ? "—" : String(row[key]));

// Match the front-end catalog exactly (pool-booking PLANS, spa services).
const POOL_PLANS = ["Solo", "Duo", "Session", "Group Function"];
const SPA_SERVICES = [
  "Spa Massage",
  "Salon and Hairstyling",
  "Facial and Skin Care",
  "Nail Spa",
  "Hair Treatment",
  "Aromatherapy",
  "Cleanup Services",
  "Manicure and Pedicure",
];

const RESOURCES: ResourceConfig[] = [
  {
    key: "pool",
    label: "Pool",
    path: "/api/admin/pool-bookings",
    kind: "booking",
    canCreate: true,
    searchPlaceholder: "Search booking ID, name, phone…",
    columns: [
      { header: "Booking ID", cell: (r) => <span className="tnum" style={{ fontWeight: 650 }}>{s(r, "reference")}</span> },
      { header: "Guest", cell: (r) => <><div className="who">{s(r, "guestName")}</div><div className="sub-txt">{s(r, "phone")}</div></> },
      { header: "Plan", cell: (r) => s(r, "poolType") },
      { header: "Pool", cell: (r) => (r.poolId ? <span style={{ fontWeight: 650, fontSize: 12.5, padding: "3px 9px", borderRadius: 7, background: Number(r.poolId) === 2 ? "rgba(85,102,212,.14)" : "rgba(15,159,180,.14)", color: Number(r.poolId) === 2 ? "#4453c0" : "#0c8394" }}>Pool {String(r.poolId)}</span> : "—") },
      { header: "Date & slot", cell: (r) => <><div>{relativeDate(String(r.date))}</div><div className="sub-txt">{s(r, "timeSlot")}</div></> },
      { header: "Amount", align: "right", cell: (r) => <span className="tnum">{inr(r.totalAmount as number)}</span> },
    ],
    fields: [
      { name: "guestName", label: "Guest name (blank = offline block)", type: "text", required: false },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "email", label: "Email", type: "email", required: false },
      { name: "poolType", label: "Plan", type: "select", options: POOL_PLANS, required: true },
      { name: "poolId", label: "Pool", type: "select", placeholder: "Auto — first available", options: [{ value: "1", label: "Pool 1 · small (≤8)" }, { value: "2", label: "Pool 2 · group (≤12)" }] },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "timeSlot", label: "Time slot (e.g. 10:00 AM - 11:00 AM)", type: "text", required: true },
      { name: "addons", label: "Add-ons", type: "text", list: true },
      { name: "totalAmount", label: "Total amount (₹)", type: "number" },
    ],
  },
  {
    key: "spa",
    label: "Spa",
    path: "/api/admin/spa-bookings",
    kind: "booking",
    canCreate: true,
    searchPlaceholder: "Search booking ID, name, phone…",
    columns: [
      { header: "Booking ID", cell: (r) => <span className="tnum" style={{ fontWeight: 650 }}>{s(r, "reference")}</span> },
      { header: "Guest", cell: (r) => <><div className="who">{s(r, "fullName")}</div><div className="sub-txt">{s(r, "phone")}</div></> },
      { header: "Service", cell: (r) => s(r, "selectedService") },
      { header: "Date & time", cell: (r) => <><div>{relativeDate(String(r.date))}</div><div className="sub-txt">{s(r, "preferredTime")}</div></> },
    ],
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: false },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "selectedService", label: "Service", type: "select", options: SPA_SERVICES, required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "preferredTime", label: "Preferred time", type: "text", required: true },
      { name: "message", label: "Message", type: "textarea" },
    ],
  },
];

export default function BookingsPage() {
  return <ResourceTable resources={RESOURCES} />;
}
