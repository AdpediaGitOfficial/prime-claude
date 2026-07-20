import type { ResourceConfig } from "./resourceController";

const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
const LEAD_STATUSES = ["NEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"];

/**
 * Central registry of every admin-managed booking/enquiry collection. Each
 * entry drives both the admin REST router and the dashboard aggregation.
 */
export const RESOURCES: Record<string, ResourceConfig & { path: string }> = {
  poolBookings: {
    path: "pool-bookings",
    model: "poolBooking",
    label: "Pool booking",
    searchFields: ["guestName", "phone", "poolType", "timeSlot"],
    sortFields: ["createdAt", "date", "totalAmount", "status", "guestName"],
    allowedStatuses: BOOKING_STATUSES,
  },
  hallBookings: {
    path: "hall-bookings",
    model: "hallBooking",
    label: "Hall booking",
    searchFields: ["fullName", "phone", "email", "organisationName", "eventType"],
    sortFields: ["createdAt", "date", "attendance", "status", "fullName"],
    allowedStatuses: BOOKING_STATUSES,
  },
  spaBookings: {
    path: "spa-bookings",
    model: "spaBooking",
    label: "Spa booking",
    searchFields: ["fullName", "email", "phone", "selectedService"],
    sortFields: ["createdAt", "date", "status", "fullName"],
    allowedStatuses: BOOKING_STATUSES,
  },
  gymMemberships: {
    path: "gym-memberships",
    model: "gymMembership",
    label: "Gym membership",
    searchFields: ["fullName", "phone", "email"],
    sortFields: ["createdAt", "status", "fullName"],
    allowedStatuses: LEAD_STATUSES,
  },
  vendorInvites: {
    path: "vendor-invites",
    model: "vendorInvite",
    label: "Vendor invite",
    searchFields: ["fullName", "phone", "email", "organisationName", "vendorType"],
    sortFields: ["createdAt", "status", "fullName"],
    allowedStatuses: LEAD_STATUSES,
  },
  courseRegistrations: {
    path: "course-registrations",
    model: "courseRegistration",
    label: "Course registration",
    searchFields: ["fullName", "email", "phone", "course"],
    sortFields: ["createdAt", "status", "fullName"],
    allowedStatuses: LEAD_STATUSES,
  },
  contactEnquiries: {
    path: "contact-enquiries",
    model: "contactEnquiry",
    label: "Contact enquiry",
    searchFields: ["fullName", "email", "phone", "subject"],
    sortFields: ["createdAt", "status", "fullName"],
    allowedStatuses: LEAD_STATUSES,
  },
};
