"use client";

import ResourceTable, { type ResourceConfig, type RowRecord } from "@/components/ResourceTable";
import { inr, relativeDate } from "@/lib/format";

const s = (row: RowRecord, key: string) => (row[key] == null ? "—" : String(row[key]));

const contactCell = (row: RowRecord) => (
  <>
    <div>{s(row, "phone")}</div>
    <div className="sub-txt">{s(row, "email")}</div>
  </>
);

const POOL_PLANS = ["Solo Dip", "Duo Splash", "Session Pass", "Group Retreat"];
const SPA_SERVICES = [
  "Signature Glow Facial",
  "Aroma Relaxation Massage",
  "Hair Spa & Styling",
  "Body Polish & Scrub",
  "Bridal Package",
];
const HALL_SLOTS = ["Morning Slot", "Evening Slot"];

const RESOURCES: ResourceConfig[] = [
  {
    key: "pool",
    label: "Pool",
    path: "/api/admin/pool-bookings",
    kind: "booking",
    canCreate: true,
    searchPlaceholder: "Search guest, phone or plan…",
    columns: [
      { header: "Guest", cell: (r) => <><div className="who">{s(r, "guestName")}</div><div className="sub-txt">{s(r, "phone")}</div></> },
      { header: "Plan", cell: (r) => s(r, "poolType") },
      { header: "Date & slot", cell: (r) => <><div>{relativeDate(String(r.date))}</div><div className="sub-txt">{s(r, "timeSlot")}</div></> },
      { header: "Amount", align: "right", cell: (r) => <span className="tnum">{inr(r.totalAmount as number)}</span> },
    ],
    fields: [
      { name: "guestName", label: "Guest name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "poolType", label: "Plan", type: "select", options: POOL_PLANS, required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "timeSlot", label: "Time slot", type: "text", required: true },
      { name: "addons", label: "Add-ons", type: "text", list: true },
      { name: "totalAmount", label: "Total amount (₹)", type: "number" },
    ],
  },
  {
    key: "hall",
    label: "Conference",
    path: "/api/admin/hall-bookings",
    kind: "booking",
    canCreate: true,
    searchPlaceholder: "Search name, organisation, event…",
    columns: [
      { header: "Contact", cell: (r) => <><div className="who">{s(r, "fullName")}</div><div className="sub-txt">{s(r, "organisationName")}</div></> },
      { header: "Details", cell: contactCell },
      { header: "Event", cell: (r) => <>{s(r, "eventType")}<div className="sub-txt">{s(r, "attendance")} guests</div></> },
      { header: "Date & slot", cell: (r) => <><div>{relativeDate(String(r.date))}</div><div className="sub-txt">{s(r, "timeSlot")}</div></> },
    ],
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "organisationName", label: "Organisation", type: "text" },
      { name: "eventType", label: "Event type", type: "text" },
      { name: "attendance", label: "Expected attendance", type: "number" },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "timeSlot", label: "Time slot", type: "select", options: HALL_SLOTS, required: true },
      { name: "additionalRequirements", label: "Additional requirements", type: "textarea" },
    ],
  },
  {
    key: "spa",
    label: "Spa",
    path: "/api/admin/spa-bookings",
    kind: "booking",
    canCreate: true,
    searchPlaceholder: "Search name, service, phone…",
    columns: [
      { header: "Guest", cell: (r) => <><div className="who">{s(r, "fullName")}</div><div className="sub-txt">{s(r, "phone")}</div></> },
      { header: "Service", cell: (r) => s(r, "selectedService") },
      { header: "Date & time", cell: (r) => <><div>{relativeDate(String(r.date))}</div><div className="sub-txt">{s(r, "preferredTime")}</div></> },
    ],
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
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
