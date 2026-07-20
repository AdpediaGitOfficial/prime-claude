import { z } from "zod";
import { phoneSchema } from "../otp/otp.schema";

/** Mirrors the conference frontend payload for POST /hall-bookings. */
export const createHallBookingSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email"),
  organisationName: z.string().trim().optional().default(""),
  eventType: z.string().trim().optional().default(""),
  attendance: z.coerce.number().int().nonnegative().optional().default(0),
  date: z.string().trim().min(1, "Date is required"),
  timeSlot: z.string().trim().min(1, "Time slot is required"),
  additionalRequirements: z.string().trim().optional().default(""),
  termsAccepted: z.boolean().optional().default(false),
});
