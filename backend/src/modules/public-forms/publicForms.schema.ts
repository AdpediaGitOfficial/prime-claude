import { z } from "zod";
import { phoneSchema } from "../otp/otp.schema";

const optionalStr = z.string().trim().optional().default("");

// ─── Past-time guard for spa bookings ───
// The spa form sends `date` as a human-readable label (e.g. "Mon, 5 Sep") and
// `preferredTime` as "10:00 AM". We block a slot only when the label is
// *definitely* today in the business timezone (Asia/Kolkata) AND the time has
// already passed — so we never falsely reject a future booking if the client's
// locale string differs slightly from the server's (it simply won't match, and
// the browser already blocks past slots).
const IST = "Asia/Kolkata";

/** Today's label in IST, matching the site's en-IN {weekday,day,month} format. */
function istTodayLabel(): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date());
}

/** Current minute-of-day in IST. */
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

/** Parse "h:00 AM/PM" → minutes-since-midnight (-1 if unparseable). */
function labelTimeToMinutes(label: string): number {
  const m = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return -1;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
}
/** Email is optional across public forms — accepts a valid address or blank. */
const emailOpt = z
  .union([z.string().trim().email("Enter a valid email"), z.literal("")])
  .optional()
  .default("");

/** POST /spa-bookings */
export const spaBookingSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: emailOpt,
    phone: phoneSchema,
    selectedService: z.string().trim().min(1, "Please choose a service"),
    date: z.string().trim().min(1, "Date is required"),
    preferredTime: z.string().trim().min(1, "Time is required"),
    message: optionalStr,
  })
  .superRefine((val, ctx) => {
    if (val.date === istTodayLabel()) {
      const mins = labelTimeToMinutes(val.preferredTime);
      if (mins >= 0 && mins <= istNowMinutes()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["preferredTime"],
          message: "That time has already passed today. Please choose a later slot.",
        });
      }
    }
  });

/** POST /gym-memberships */
export const gymMembershipSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: phoneSchema,
  email: emailOpt,
  age: z.coerce.number().int().positive().max(120).optional(),
  message: optionalStr,
});

/** POST /vendor-invites (invite page + counter enquiry panel) */
export const vendorInviteSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: phoneSchema,
  email: emailOpt,
  organisationName: optionalStr,
  vendorType: optionalStr,
  counters: z.array(z.string()).optional().default([]),
  preferredDuration: optionalStr,
  additionalRequirements: optionalStr,
  termsAccepted: z.boolean().optional().default(false),
});

/** POST /course-registrations */
export const courseRegistrationSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: emailOpt,
  phone: phoneSchema,
  course: z.string().trim().min(1, "Please select a course"),
  message: optionalStr,
});

/** POST /contact-enquiries */
export const contactEnquirySchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: emailOpt,
  phone: z.string().trim().optional().default(""),
  subject: optionalStr,
  message: z.string().trim().min(1, "Message is required"),
});
