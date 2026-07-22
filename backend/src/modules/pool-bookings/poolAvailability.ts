import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

/** Number of physical pools that can be reserved at the same instant. */
export const POOL_CAPACITY = 2;

/** Booking statuses that still occupy a pool (everything except CANCELLED). */
const OCCUPYING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED"] as const;

export type Interval = { start: number; end: number };

/** Parse "10:00 AM" → minutes since midnight, or null if unparseable. */
function parseTime(raw: string): number | null {
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

/** Parse a stored slot label "10:00 AM - 11:30 AM" → interval in minutes. */
export function parseSlot(timeSlot: string): Interval | null {
  const parts = timeSlot.split(/\s*-\s*/);
  if (parts.length !== 2) return null;
  const start = parseTime(parts[0]);
  const end = parseTime(parts[1]);
  if (start == null || end == null || end <= start) return null;
  return { start, end };
}

/**
 * Busiest number of `existing` intervals that overlap at any single instant
 * inside `win`. Touching intervals (one ends exactly when another starts) are
 * NOT counted as concurrent.
 */
export function busiestWithin(existing: Interval[], win: Interval): number {
  const events: Array<[number, number]> = [];
  for (const iv of existing) {
    const s = Math.max(iv.start, win.start);
    const e = Math.min(iv.end, win.end);
    if (s < e) {
      events.push([s, 1]);
      events.push([e, -1]);
    }
  }
  // At an equal coordinate, process ends (-1) before starts (+1).
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let cur = 0;
  let max = 0;
  for (const [, delta] of events) {
    cur += delta;
    if (cur > max) max = cur;
  }
  return max;
}

/** All occupying intervals for a given date (excludes CANCELLED). */
export async function occupiedIntervals(date: string): Promise<Interval[]> {
  const rows = await prisma.poolBooking.findMany({
    where: { date, status: { in: [...OCCUPYING_STATUSES] } },
    select: { timeSlot: true },
  });
  return rows
    .map((r) => parseSlot(r.timeSlot))
    .filter((iv): iv is Interval => iv !== null);
}

/**
 * Throw a 409 if booking `timeSlot` on `date` would exceed pool capacity.
 * Called on every create path so the last free pool can't be double-booked.
 */
export async function assertPoolAvailable(date: string, timeSlot: string): Promise<void> {
  const win = parseSlot(timeSlot);
  if (!win) return; // unparseable slot — nothing to enforce
  const existing = await occupiedIntervals(date);
  if (busiestWithin(existing, win) >= POOL_CAPACITY) {
    throw AppError.conflict("This time slot is fully booked. Please choose another slot.");
  }
}
