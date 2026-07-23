import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { verifyOtp } from "../otp/otp.service";
import { assignPool, occupiedByPool } from "./poolAvailability";

/**
 * POST /api/bookings/create-verified
 * Public — verifies the OTP then creates a confirmed pool booking.
 */
export const createVerifiedPoolBooking = asyncHandler(async (req: Request, res: Response) => {
  const { guest, phone, otp, poolType, date, timeSlot, addons, totalAmount } = req.body as {
    guest: string; phone: string; otp: string; poolType: string;
    date: string; timeSlot: string; addons: string[]; totalAmount: number;
  };

  await verifyOtp(phone, otp, "pool_booking");
  const poolId = await assignPool(date, timeSlot, poolType);

  const booking = await prisma.poolBooking.create({
    data: {
      guestName: guest, phone, poolId, poolType, date, timeSlot, addons, totalAmount,
      otpVerified: true, status: "CONFIRMED",
    },
  });
  return res.status(201).json(booking);
});

/**
 * POST /pool-bookings
 * Public — creates a pool booking directly (no OTP). Email optional. The pool
 * is assigned automatically (Pool 1 first for small plans, else Pool 2; Group
 * only Pool 2) and is NOT returned to the customer.
 */
export const createDirectPoolBooking = asyncHandler(async (req: Request, res: Response) => {
  const { guest, phone, email, poolType, date, timeSlot, addons, totalAmount } = req.body as {
    guest: string; phone: string; email?: string; poolType: string;
    date: string; timeSlot: string; addons: string[]; totalAmount: number;
  };

  const poolId = await assignPool(date, timeSlot, poolType);

  const booking = await prisma.poolBooking.create({
    data: {
      guestName: guest, phone, email: email || null, poolId, poolType, date, timeSlot,
      addons, totalAmount, otpVerified: false, status: "PENDING",
    },
  });

  // Strip the internal pool id from the customer-facing response.
  const { poolId: _pool, ...customerView } = booking;
  return res.status(201).json(customerView);
});

/**
 * GET /pool-bookings?date=YYYY-MM-DD
 * Public — occupied intervals per pool for a date so the picker can show
 * per-plan availability. No personal data, no booking ids.
 */
export const getPoolAvailability = asyncHandler(async (req: Request, res: Response) => {
  const date = String(req.query.date ?? "").trim();
  if (!date) return res.json({ pool1: [], pool2: [] });
  const occ = await occupiedByPool(date);
  return res.json({ pool1: occ[1], pool2: occ[2] });
});

/**
 * POST /api/admin/pool-bookings  (admin)
 * Create / block a slot manually (e.g. a walk-in customer at the premises).
 * The pool can be forced via `poolId` (validated against the plan + availability)
 * or left blank to auto-assign.
 */
export const createAdminPoolBooking = asyncHandler(async (req: Request, res: Response) => {
  const {
    guestName, phone, email, poolType, date, timeSlot, poolId: requested,
    addons, totalAmount, status, source,
  } = req.body as {
    guestName?: string; phone: string; email?: string; poolType: string;
    date: string; timeSlot: string; poolId?: number | null; addons?: string[];
    totalAmount?: number; status?: string; source?: string;
  };

  const poolId = await assignPool(date, timeSlot, poolType, requested ?? null);

  const booking = await prisma.poolBooking.create({
    data: {
      guestName: guestName?.trim() || "Offline booking",
      phone, email: email || null, poolId, poolType, date, timeSlot,
      addons: addons ?? [], totalAmount: totalAmount ?? 0,
      otpVerified: true,
      status: (status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED") ?? "CONFIRMED",
      source: source || "offline",
    },
  });
  return sendSuccess(res, booking, "Pool booking created", 201);
});

/**
 * GET /api/admin/pool-bookings/calendar?date=YYYY-MM-DD  (admin)
 * Both pools' bookings for a date with full detail (staff availability view).
 */
export const getPoolCalendar = asyncHandler(async (req: Request, res: Response) => {
  const date = String(req.query.date ?? "").trim();
  if (!date) throw new Error("date is required");
  const rows = await prisma.poolBooking.findMany({
    where: { date, status: { not: "CANCELLED" } },
    select: {
      id: true, reference: true, guestName: true, phone: true, poolId: true,
      poolType: true, timeSlot: true, status: true, source: true,
    },
    orderBy: { timeSlot: "asc" },
  });
  const pool1 = rows.filter((r) => (r.poolId ?? 1) === 1);
  const pool2 = rows.filter((r) => r.poolId === 2);
  return sendSuccess(res, { date, pool1, pool2 }, "Pool calendar");
});
