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

/** POST /api/admin/pool-bookings — admin create / block a slot. */
export const adminBlockPoolBookingSchema = z.object({
  guestName: z.string().trim().optional().default(""),
  phone: z.string().trim().regex(/^\+?\d{10,15}$/, "Enter a valid phone number"),
  email: z
    .union([z.string().trim().email("Enter a valid email"), z.literal("")])
    .optional()
    .default(""),
  poolType: z.string().trim().min(1, "Plan is required"),
  date: z.string().trim().min(1, "Date is required"),
  timeSlot: z.string().trim().min(1, "Time slot is required"),
  poolId: z.coerce.number().int().min(1).max(2).optional(), // omitted = auto-assign
  addons: z.array(z.string()).optional().default([]),
  totalAmount: z.coerce.number().int().nonnegative().optional().default(0),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional().default("CONFIRMED"),
});

/** POST /pool-bookings — direct pool booking (no OTP). Email optional. */
export const createDirectPoolBookingSchema = z.object({
  guest: z.string().trim().min(1, "Guest name is required"),
  phone: phoneSchema,
  email: z
    .union([z.string().trim().email("Enter a valid email"), z.literal("")])
    .optional()
    .default(""),
  poolType: z.string().trim().min(1, "Please select a plan"),
  date: z.string().trim().min(1, "Date is required"),
  timeSlot: z.string().trim().min(1, "Time slot is required"),
  addons: z.array(z.string()).optional().default([]),
  totalAmount: z.coerce.number().int().nonnegative().optional().default(0),
});
