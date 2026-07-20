import { z } from "zod";
import { phoneSchema } from "../otp/otp.schema";

const optionalStr = z.string().trim().optional().default("");

/** POST /spa-bookings */
export const spaBookingSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: phoneSchema,
  selectedService: z.string().trim().min(1, "Please choose a service"),
  date: z.string().trim().min(1, "Date is required"),
  preferredTime: z.string().trim().min(1, "Time is required"),
  message: optionalStr,
});

/** POST /gym-memberships */
export const gymMembershipSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email"),
  age: z.coerce.number().int().positive().max(120).optional(),
  message: optionalStr,
});

/** POST /vendor-invites (invite page + counter enquiry panel) */
export const vendorInviteSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email"),
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
  email: z.string().trim().email("Enter a valid email"),
  phone: phoneSchema,
  course: z.string().trim().min(1, "Please select a course"),
  message: optionalStr,
});

/** POST /contact-enquiries */
export const contactEnquirySchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().optional().default(""),
  subject: optionalStr,
  message: z.string().trim().min(1, "Message is required"),
});
