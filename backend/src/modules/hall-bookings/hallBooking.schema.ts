import { z } from "zod";
import { phoneSchema } from "../otp/otp.schema";

const IST = "Asia/Kolkata";
/** Slot start times (minutes since midnight): Morning 11:00, Evening 17:00. */
const SLOT_START: Array<{ test: RegExp; start: number }> = [
  { test: /morning/i, start: 660 },
  { test: /evening/i, start: 1020 },
];

/** Today's date (yyyy-mm-dd) in the business timezone. */
function istToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: IST }).format(new Date());
}
/** Current minute-of-day in the business timezone. */
function istNowMinutes(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? "0");
  let hour = get("hour");
  if (hour === 24) hour = 0;
  return hour * 60 + get("minute");
}

/** Mirrors the conference frontend payload for POST /hall-bookings. */
export const createHallBookingSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    phone: phoneSchema,
    email: z
      .union([z.string().trim().email("Enter a valid email"), z.literal("")])
      .optional()
      .default(""),
    organisationName: z.string().trim().optional().default(""),
    eventType: z.string().trim().optional().default(""),
    attendance: z.coerce.number().int().nonnegative().optional().default(0),
    date: z.string().trim().min(1, "Date is required"),
    timeSlot: z.string().trim().min(1, "Time slot is required"),
    additionalRequirements: z.string().trim().optional().default(""),
    termsAccepted: z.boolean().optional().default(false),
  })
  .superRefine((val, ctx) => {
    // Block a slot whose start time has already passed on today's date (IST).
    if (val.date !== istToday()) return;
    const slot = SLOT_START.find((s) => s.test.test(val.timeSlot));
    if (slot && slot.start <= istNowMinutes()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["timeSlot"],
        message: "That slot has already started today. Please choose a later date or slot.",
      });
    }
  });
