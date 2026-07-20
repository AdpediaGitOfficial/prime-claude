import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { verifyOtp } from "../otp/otp.service";

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
