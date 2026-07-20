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

const RESOURCES: ResourceConfig[] = [
  {
    key: "pool",
    label: "Pool",
    path: "/api/admin/pool-bookings",
    kind: "booking",
    searchPlaceholder: "Search guest, phone or plan…",
    columns: [
      { header: "Guest", cell: (r) => <><div className="who">{s(r, "guestName")}</div><div className="sub-txt">{s(r, "phone")}</div></> },
      { header: "Plan", cell: (r) => s(r, "poolType") },
      { header: "Date & slot", cell: (r) => <><div>{relativeDate(String(r.date))}</div><div className="sub-txt">{s(r, "timeSlot")}</div></> },
      { header: "Amount", align: "right", cell: (r) => <span className="tnum">{inr(r.totalAmount as number)}</span> },
    ],
  },
  {
    key: "hall",
    label: "Conference",
    path: "/api/admin/hall-bookings",
    kind: "booking",
    searchPlaceholder: "Search name, organisation, event…",
    columns: [
      { header: "Contact", cell: (r) => <><div className="who">{s(r, "fullName")}</div><div className="sub-txt">{s(r, "organisationName")}</div></> },
      { header: "Details", cell: contactCell },
      { header: "Event", cell: (r) => <>{s(r, "eventType")}<div className="sub-txt">{s(r, "attendance")} guests</div></> },
      { header: "Date & slot", cell: (r) => <><div>{relativeDate(String(r.date))}</div><div className="sub-txt">{s(r, "timeSlot")}</div></> },
    ],
  },
  {
    key: "spa",
    label: "Spa",
    path: "/api/admin/spa-bookings",
    kind: "booking",
    searchPlaceholder: "Search name, service, phone…",
    columns: [
      { header: "Guest", cell: (r) => <><div className="who">{s(r, "fullName")}</div><div className="sub-txt">{s(r, "phone")}</div></> },
      { header: "Service", cell: (r) => s(r, "selectedService") },
      { header: "Date & time", cell: (r) => <><div>{relativeDate(String(r.date))}</div><div className="sub-txt">{s(r, "preferredTime")}</div></> },
    ],
  },
];

export default function BookingsPage() {
  return <ResourceTable resources={RESOURCES} />;
}
