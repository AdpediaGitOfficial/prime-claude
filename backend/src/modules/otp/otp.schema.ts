import { z } from "zod";

// Accepts "+919876543210" or a bare 10-digit number.
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?\d{10,15}$/, "Enter a valid phone number");

export const sendOtpSchema = z.object({
  phone: phoneSchema,
  purpose: z.string().optional(),
});
