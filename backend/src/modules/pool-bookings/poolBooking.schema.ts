import { z } from "zod";
import { phoneSchema } from "../otp/otp.schema";

/** Mirrors the pool-booking frontend payload for POST /api/bookings/create-verified. */
export const createPoolBookingSchema = z.object({
  guest: z.string().trim().min(1, "Guest name is required"),
  phone: phoneSchema,
  otp: z.string().trim().min(3, "OTP is required"),
  poolType: z.string().trim().min(1, "Please select a plan"),
  date: z.string().trim().min(1, "Date is required"),
  timeSlot: z.string().trim().min(1, "Time slot is required"),
  addons: z.array(z.string()).optional().default([]),
  totalAmount: z.coerce.number().int().nonnegative().optional().default(0),
});
