"use client";

import ResourceTable, { type ResourceConfig, type RowRecord } from "@/components/ResourceTable";
import { dateTime } from "@/lib/format";

const s = (row: RowRecord, key: string) => (row[key] == null || row[key] === "" ? "—" : String(row[key]));

const nameContact = (r: RowRecord) => (
  <>
    <div className="who">{s(r, "fullName")}</div>
    <div className="sub-txt">{s(r, "phone")} · {s(r, "email")}</div>
  </>
);
const received = (r: RowRecord) => <span className="sub-txt">{dateTime(String(r.createdAt))}</span>;

const VENDOR_TYPES = ["Fashion", "Food & Beverage", "Health & Wellness", "Retail Products"];
const DURATIONS = ["1 Week", "1 Month", "1 Year"];

const RESOURCES: ResourceConfig[] = [
  {
    key: "vendor",
    label: "Vendor",
    path: "/api/admin/vendor-invites",
    kind: "lead",
    searchPlaceholder: "Search name, brand, vendor type…",
    columns: [
      { header: "Name", cell: nameContact },
      { header: "Brand", cell: (r) => s(r, "organisationName") },
      { header: "Interest", cell: (r) => {
          const counters = Array.isArray(r.counters) ? (r.counters as string[]) : [];
          return <>{s(r, "vendorType")}<div className="sub-txt">{counters.length ? counters.join(", ") : "—"}{r.preferredDuration ? ` · ${r.preferredDuration}` : ""}</div></>;
        } },
      { header: "Received", cell: received },
    ],
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "organisationName", label: "Brand / business", type: "text" },
      { name: "vendorType", label: "Vendor type", type: "select", options: VENDOR_TYPES },
      { name: "counters", label: "Counters", type: "text", list: true },
      { name: "preferredDuration", label: "Preferred duration", type: "select", options: DURATIONS },
      { name: "additionalRequirements", label: "Notes", type: "textarea" },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    path: "/api/admin/contact-enquiries",
    kind: "lead",
    searchPlaceholder: "Search name, subject, email…",
    columns: [
      { header: "Name", cell: nameContact },
      { header: "Subject", cell: (r) => s(r, "subject") },
      { header: "Message", cell: (r) => <span className="sub-txt">{s(r, "message")}</span> },
      { header: "Received", cell: received },
    ],
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "subject", label: "Subject", type: "text" },
      { name: "message", label: "Message", type: "textarea", required: true },
    ],
  },
];

export default function EnquiriesPage() {
  return <ResourceTable resources={RESOURCES} />;
}
