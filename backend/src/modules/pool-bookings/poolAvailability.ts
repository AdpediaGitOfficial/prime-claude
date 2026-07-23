import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

/**
 * Two physical pools with roles:
 *   Pool 1 — small pool  (Solo / Duo / Session, ≤ 8 guests)
 *   Pool 2 — group pool  (Group Function, ≤ 12 guests) + small overflow
 *
 * Assignment rules:
 *   • Group Function  → Pool 2 only.
 *   • Small plans     → Pool 1 first, spill to Pool 2 only when Pool 1 is busy.
 * So the group pool stays reserved for groups until the small pool is taken.
 */
export const POOL_SMALL = 1;
export const POOL_GROUP = 2;
export const OPEN_MIN = 600;   // 10:00 AM
export const CLOSE_MIN = 1320; // 10:00 PM

/** Booking statuses that still occupy a pool (everything except CANCELLED). */
const OCCUPYING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED"] as const;

export type Interval = { start: number; end: number };
export type PoolOccupancy = { 1: Interval[]; 2: Interval[] };

/** A plan is a group booking when its name mentions "group". */
export function isGroupPlan(poolType: string): boolean {
  return /group/i.test(poolType || "");
}

/** Pools a plan may use, in assignment-preference order. */
export function eligiblePools(poolType: string): number[] {
  return isGroupPlan(poolType) ? [POOL_GROUP] : [POOL_SMALL, POOL_GROUP];
}

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

/** Parse "10:00 AM - 11:30 AM" → interval in minutes. */
export function parseSlot(timeSlot: string): Interval | null {
  const parts = timeSlot.split(/\s*-\s*/);
  if (parts.length !== 2) return null;
  const start = parseTime(parts[0]);
  const end = parseTime(parts[1]);
  if (start == null || end == null || end <= start) return null;
  return { start, end };
}

const overlaps = (a: Interval, b: Interval) => a.start < b.end && a.end > b.start;
const poolBusy = (ivs: Interval[], win: Interval) => ivs.some((iv) => overlaps(iv, win));

/** Occupied intervals for a date, grouped by pool (excludes CANCELLED). */
export async function occupiedByPool(date: string): Promise<PoolOccupancy> {
  const rows = await prisma.poolBooking.findMany({
    where: { date, status: { in: [...OCCUPYING_STATUSES] } },
    select: { timeSlot: true, poolId: true },
  });
  const out: PoolOccupancy = { 1: [], 2: [] };
  for (const r of rows) {
    const iv = parseSlot(r.timeSlot);
    if (!iv) continue;
    const pid = r.poolId === 2 ? 2 : 1; // legacy null → treat as pool 1
    out[pid].push(iv);
  }
  return out;
}

/**
 * Decide which pool a booking gets.
 * @param requestedPool  when set (admin), force this pool (validated).
 * @returns the assigned pool id (1 or 2).
 * @throws 400 if the requested pool is invalid for the plan, 409 if no pool free.
 */
export async function assignPool(
  date: string,
  timeSlot: string,
  poolType: string,
  requestedPool?: number | null,
): Promise<number> {
  const win = parseSlot(timeSlot);
  if (!win) throw AppError.badRequest("Invalid time slot.");
  if (win.start < OPEN_MIN || win.end > CLOSE_MIN)
    throw AppError.badRequest("Bookings are available 10:00 AM – 10:00 PM only.");
  const eligible = eligiblePools(poolType);
  const occ = await occupiedByPool(date);
  const isFree = (p: number) => !poolBusy(occ[p as 1 | 2], win);

  if (requestedPool) {
    if (!eligible.includes(requestedPool)) {
      throw AppError.badRequest(
        isGroupPlan(poolType)
          ? "Group Function can only use the group pool (Pool 2)."
          : `Pool ${requestedPool} is not valid for this plan.`,
      );
    }
    if (!isFree(requestedPool)) {
      throw AppError.conflict(`Pool ${requestedPool} is already booked for this time.`);
    }
    return requestedPool;
  }

  for (const p of eligible) {
    if (isFree(p)) return p;
  }
  throw AppError.conflict("This time slot is fully booked. Please choose another slot.");
}
