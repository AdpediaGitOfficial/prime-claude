import { z } from "zod";
import type { ResourceConfig } from "./resourceController";

const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;
const LEAD_STATUSES = ["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"] as const;

const bookingStatus = z.enum(BOOKING_STATUSES);
const leadStatus = z.enum(LEAD_STATUSES);
const req = (label: string) => z.string().trim().min(1, `${label} is required`);
const opt = z.string().trim().optional();
const email = z
  .union([z.string().trim().email("Enter a valid email"), z.literal("")])
  .optional()
  .default("");
const phone = z.string().trim().regex(/^\+?\d{10,15}$/, "Enter a valid phone number");

// ─── Admin create schemas (walk-in / manual entry) ───
const poolCreate = z.object({
  guestName: req("Guest name"),
  phone,
  email,
  poolType: req("Plan"),
  date: req("Date"),
  timeSlot: req("Time slot"),
  addons: z.array(z.string()).optional().default([]),
  totalAmount: z.coerce.number().int().nonnegative().optional().default(0),
  status: bookingStatus.optional().default("CONFIRMED"),
});
const hallCreate = z.object({
  fullName: req("Full name"),
  phone,
  email,
  organisationName: opt,
  eventType: opt,
  attendance: z.coerce.number().int().nonnegative().optional().default(0),
  date: req("Date"),
  timeSlot: req("Time slot"),
  additionalRequirements: opt,
  status: bookingStatus.optional().default("PENDING"),
});
const spaCreate = z.object({
  fullName: req("Full name"),
  email,
  phone,
  selectedService: req("Service"),
  date: req("Date"),
  preferredTime: req("Time"),
  message: opt,
  status: bookingStatus.optional().default("PENDING"),
});
const gymCreate = z.object({
  fullName: req("Full name"),
  phone,
  email,
  age: z.coerce.number().int().positive().max(120).optional(),
  message: opt,
  status: leadStatus.optional().default("NEW"),
});
const vendorCreate = z.object({
  fullName: req("Full name"),
  phone,
  email,
  organisationName: opt,
  vendorType: opt,
  counters: z.array(z.string()).optional().default([]),
  preferredDuration: opt,
  additionalRequirements: opt,
  status: leadStatus.optional().default("NEW"),
});
const courseCreate = z.object({
  fullName: req("Full name"),
  email,
  phone,
  course: req("Course"),
  message: opt,
  status: leadStatus.optional().default("NEW"),
});
const contactCreate = z.object({
  fullName: req("Full name"),
  email,
  phone: opt,
  subject: opt,
  message: req("Message"),
  status: leadStatus.optional().default("NEW"),
});

/**
 * Central registry of every admin-managed booking/enquiry collection. Each
 * entry drives the admin REST router and the dashboard aggregation. Booking
 * resources also carry create/update schemas (walk-in entry + edit).
 */
export const RESOURCES: Record<string, ResourceConfig & { path: string }> = {
  poolBookings: {
    path: "pool-bookings",
    model: "poolBooking",
    label: "Pool booking",
    searchFields: ["guestName", "phone", "poolType", "timeSlot"],
    sortFields: ["createdAt", "date", "totalAmount", "status", "guestName"],
    allowedStatuses: [...BOOKING_STATUSES],
    createSchema: poolCreate,
    updateSchema: poolCreate.partial(),
  },
  hallBookings: {
    path: "hall-bookings",
    model: "hallBooking",
    label: "Hall booking",
    searchFields: ["fullName", "phone", "email", "organisationName", "eventType"],
    sortFields: ["createdAt", "date", "attendance", "status", "fullName"],
    allowedStatuses: [...BOOKING_STATUSES],
    createSchema: hallCreate,
    updateSchema: hallCreate.partial(),
  },
  spaBookings: {
    path: "spa-bookings",
    model: "spaBooking",
    label: "Spa booking",
    searchFields: ["fullName", "email", "phone", "selectedService"],
    sortFields: ["createdAt", "date", "status", "fullName"],
    allowedStatuses: [...BOOKING_STATUSES],
    createSchema: spaCreate,
    updateSchema: spaCreate.partial(),
  },
  gymMemberships: {
    path: "gym-memberships",
    model: "gymMembership",
    label: "Gym membership",
    searchFields: ["fullName", "phone", "email"],
    sortFields: ["createdAt", "status", "fullName"],
    allowedStatuses: [...LEAD_STATUSES],
    createSchema: gymCreate,
    updateSchema: gymCreate.partial(),
  },
  vendorInvites: {
    path: "vendor-invites",
    model: "vendorInvite",
    label: "Vendor invite",
    searchFields: ["fullName", "phone", "email", "organisationName", "vendorType"],
    sortFields: ["createdAt", "status", "fullName"],
    allowedStatuses: [...LEAD_STATUSES],
    createSchema: vendorCreate,
    updateSchema: vendorCreate.partial(),
  },
  courseRegistrations: {
    path: "course-registrations",
    model: "courseRegistration",
    label: "Course registration",
    searchFields: ["fullName", "email", "phone", "course"],
    sortFields: ["createdAt", "status", "fullName"],
    allowedStatuses: [...LEAD_STATUSES],
    createSchema: courseCreate,
    updateSchema: courseCreate.partial(),
  },
  contactEnquiries: {
    path: "contact-enquiries",
    model: "contactEnquiry",
    label: "Contact enquiry",
    searchFields: ["fullName", "email", "phone", "subject"],
    sortFields: ["createdAt", "status", "fullName"],
    allowedStatuses: [...LEAD_STATUSES],
    createSchema: contactCreate,
    updateSchema: contactCreate.partial(),
  },
};
