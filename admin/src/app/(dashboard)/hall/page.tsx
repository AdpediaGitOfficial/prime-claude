"use client";

import ResourceTable, { type ResourceConfig, type RowRecord } from "@/components/ResourceTable";
import { relativeDate } from "@/lib/format";

const s = (row: RowRecord, key: string) => (row[key] == null || row[key] === "" ? "—" : String(row[key]));

const HALL_SLOTS = ["Morning Slot", "Evening Slot"];

// Regal Hall (conference) booking requests from the /conference page.
const RESOURCES: ResourceConfig[] = [
  {
    key: "hall",
    label: "Hall booking",
    path: "/api/admin/hall-bookings",
    kind: "booking",
    canCreate: true,
    searchPlaceholder: "Search name, organisation, event…",
    columns: [
      {
        header: "Organiser",
        cell: (r) => (
          <>
            <div className="who">{s(r, "fullName")}</div>
            <div className="sub-txt">{s(r, "organisationName")}</div>
          </>
        ),
      },
      {
        header: "Contact",
        cell: (r) => (
          <>
            <div>{s(r, "phone")}</div>
            <div className="sub-txt">{s(r, "email")}</div>
          </>
        ),
      },
      {
        header: "Event",
        cell: (r) => (
          <>
            {s(r, "eventType")}
            <div className="sub-txt">{s(r, "attendance")} guests</div>
          </>
        ),
      },
      {
        header: "Date & slot",
        cell: (r) => (
          <>
            <div>{relativeDate(String(r.date))}</div>
            <div className="sub-txt">{s(r, "timeSlot")}</div>
          </>
        ),
      },
    ],
    fields: [
      { name: "fullName", label: "Organiser name", type: "text", required: true },
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
];

export default function HallPage() {
  return <ResourceTable resources={RESOURCES} />;
}
