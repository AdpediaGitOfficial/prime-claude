"use client";

import ResourceTable, { type ResourceConfig, type RowRecord } from "@/components/ResourceTable";
import { dateTime } from "@/lib/format";

const s = (row: RowRecord, key: string) => (row[key] == null || row[key] === "" ? "—" : String(row[key]));

const COURSE_OPTIONS = [
  "Tekla Structures – Basic to Advanced",
  "Structural Steel Design - Basic to Advanced",
];

// Course enrollments submitted from the study-centre "Enroll Now" form.
const RESOURCES: ResourceConfig[] = [
  {
    key: "course",
    label: "Course enrollment",
    path: "/api/admin/course-registrations",
    kind: "lead",
    searchPlaceholder: "Search enrollment ID, name, phone…",
    columns: [
      { header: "Enrollment ID", cell: (r) => <span className="tnum" style={{ fontWeight: 650 }}>{s(r, "reference")}</span> },
      {
        header: "Name",
        cell: (r) => (
          <>
            <div className="who">{s(r, "fullName")}</div>
            <div className="sub-txt">{s(r, "phone")} · {s(r, "email")}</div>
          </>
        ),
      },
      { header: "Course", cell: (r) => s(r, "course") },
      { header: "Received", cell: (r) => <span className="sub-txt">{dateTime(String(r.createdAt))}</span> },
    ],
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: false },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "course", label: "Course", type: "select", options: COURSE_OPTIONS, required: true },
      { name: "message", label: "Message", type: "textarea" },
    ],
  },
];

export default function EnrollmentsPage() {
  return <ResourceTable resources={RESOURCES} />;
}
