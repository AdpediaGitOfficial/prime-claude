"use client";

import ResourceTable, { type ResourceConfig, type RowRecord } from "@/components/ResourceTable";
import { dateTime } from "@/lib/format";

const s = (row: RowRecord, key: string) => (row[key] == null || row[key] === "" ? "—" : String(row[key]));

// The gym page has no package tiers — only membership enquiries to manage.
const RESOURCES: ResourceConfig[] = [
  {
    key: "gym",
    label: "Gym enquiry",
    path: "/api/admin/gym-memberships",
    kind: "lead",
    searchPlaceholder: "Search name, phone, email…",
    columns: [
      {
        header: "Name",
        cell: (r) => (
          <>
            <div className="who">{s(r, "fullName")}</div>
            <div className="sub-txt">{s(r, "phone")} · {s(r, "email")}</div>
          </>
        ),
      },
      { header: "Age", cell: (r) => s(r, "age") },
      { header: "Message", cell: (r) => <span className="sub-txt">{s(r, "message")}</span> },
      { header: "Received", cell: (r) => <span className="sub-txt">{dateTime(String(r.createdAt))}</span> },
    ],
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "age", label: "Age", type: "number" },
      { name: "message", label: "Message", type: "textarea" },
    ],
  },
];

export default function GymPage() {
  return <ResourceTable resources={RESOURCES} />;
}
