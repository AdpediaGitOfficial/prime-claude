export function inr(amount?: number | null): string {
  if (amount === undefined || amount === null) return "—";
  return "₹" + amount.toLocaleString("en-IN");
}

export function relativeDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function dateTime(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

/** Map a booking/lead status to a chip colour class. */
export function statusClass(status: string): "good" | "warn" | "bad" | "info" {
  switch (status) {
    case "CONFIRMED":
    case "RESOLVED":
      return "good";
    case "PENDING":
    case "NEW":
      return "warn";
    case "CANCELLED":
      return "bad";
    default:
      return "info"; // COMPLETED, IN_PROGRESS, ARCHIVED
  }
}

export function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
