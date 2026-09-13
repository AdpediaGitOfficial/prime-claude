import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";

/**
 * GET /hall-bookings
 * Public — the conference calendar reads this to grey out already-booked dates.
 * MUST return a raw array of records with a `date` field (existing contract).
 */
export const listPublicHallBookings = asyncHandler(async (_req: Request, res: Response) => {
  const bookings = await prisma.hallBooking.findMany({
    where: { status: { in: ["PENDING", "CONFIRMED"] } },
    select: { id: true, date: true, timeSlot: true },
    orderBy: { date: "asc" },
  });
  return res.status(200).json(bookings);
});

/**
 * POST /hall-bookings
 * Public — creates a hall booking. Returns the created record (raw shape) so
 * the frontend can read `createdBooking.date`.
 */
export const createHallBooking = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body as {
    fullName: string;
    phone: string;
    email: string;
    organisationName: string;
    eventType: string;
    attendance: number;
    date: string;
    timeSlot: string;
    additionalRequirements: string;
    termsAccepted: boolean;
  };

  const booking = await prisma.hallBooking.create({ data });
  return res.status(201).json(booking);
});
