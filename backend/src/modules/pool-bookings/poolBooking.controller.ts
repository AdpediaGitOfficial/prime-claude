import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { verifyOtp } from "../otp/otp.service";
import { assertPoolAvailable, occupiedIntervals, POOL_CAPACITY } from "./poolAvailability";

/**
 * POST /api/bookings/create-verified
 * Public — verifies the OTP then creates a confirmed pool booking.
 * Returns the created record (raw shape, to match the existing frontend).
 */
export const createVerifiedPoolBooking = asyncHandler(async (req: Request, res: Response) => {
  const { guest, phone, otp, poolType, date, timeSlot, addons, totalAmount } = req.body as {
    guest: string;
    phone: string;
    otp: string;
    poolType: string;
    date: string;
    timeSlot: string;
    addons: string[];
    totalAmount: number;
  };

  await verifyOtp(phone, otp, "pool_booking");
  await assertPoolAvailable(date, timeSlot);

  const booking = await prisma.poolBooking.create({
    data: {
      guestName: guest,
      phone,
      poolType,
      date,
      timeSlot,
      addons,
      totalAmount,
      otpVerified: true,
      status: "CONFIRMED",
    },
  });

  return res.status(201).json(booking);
});

/**
 * POST /pool-bookings
 * Public — creates a pool booking directly (no OTP). Email is optional.
 * Returns the created record (raw shape, to match the frontend).
 */
export const createDirectPoolBooking = asyncHandler(async (req: Request, res: Response) => {
  const { guest, phone, email, poolType, date, timeSlot, addons, totalAmount } = req.body as {
    guest: string;
    phone: string;
    email?: string;
    poolType: string;
    date: string;
    timeSlot: string;
    addons: string[];
    totalAmount: number;
  };

  await assertPoolAvailable(date, timeSlot);

  const booking = await prisma.poolBooking.create({
    data: {
      guestName: guest,
      phone,
      email: email || null,
      poolType,
      date,
      timeSlot,
      addons,
      totalAmount,
      otpVerified: false,
      status: "PENDING",
    },
  });

  return res.status(201).json(booking);
});

/**
 * GET /pool-bookings?date=YYYY-MM-DD
 * Public — returns the occupied pool intervals for a date so the booking page
 * can show per-slot availability. No personal data is exposed.
 */
export const getPoolAvailability = asyncHandler(async (req: Request, res: Response) => {
  const date = String(req.query.date ?? "").trim();
  if (!date) return res.json({ capacity: POOL_CAPACITY, occupied: [] });
  const occupied = await occupiedIntervals(date);
  return res.json({ capacity: POOL_CAPACITY, occupied });
});
