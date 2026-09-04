import { Router } from "express";
import { validate } from "../../middleware/validate";
import { createPublicCreateHandler } from "../_shared/publicCreate";
import {
  spaBookingSchema,
  gymMembershipSchema,
  vendorInviteSchema,
  courseRegistrationSchema,
  contactEnquirySchema,
} from "./publicForms.schema";

const router = Router();

/**
 * @openapi
 * /spa-bookings:
 *   post: { tags: [Public - Forms], summary: Create a spa appointment request, responses: { 201: { description: Created } } }
 * /gym-memberships:
 *   post: { tags: [Public - Forms], summary: Create a gym membership enquiry, responses: { 201: { description: Created } } }
 * /vendor-invites:
 *   post: { tags: [Public - Forms], summary: Create a vendor counter enquiry, responses: { 201: { description: Created } } }
 * /course-registrations:
 *   post: { tags: [Public - Forms], summary: Create a course registration, responses: { 201: { description: Created } } }
 * /contact-enquiries:
 *   post: { tags: [Public - Forms], summary: Create a contact enquiry, responses: { 201: { description: Created } } }
 */
router.post("/spa-bookings", validate({ body: spaBookingSchema }), createPublicCreateHandler("spaBooking"));
router.post("/gym-memberships", validate({ body: gymMembershipSchema }), createPublicCreateHandler("gymMembership"));
router.post("/vendor-invites", validate({ body: vendorInviteSchema }), createPublicCreateHandler("vendorInvite"));
router.post("/course-registrations", validate({ body: courseRegistrationSchema }), createPublicCreateHandler("courseRegistration"));
router.post("/contact-enquiries", validate({ body: contactEnquirySchema }), createPublicCreateHandler("contactEnquiry"));

export default router;
