import { Router } from "express";
import otpRoutes from "../modules/otp/otp.routes";
import poolBookingRoutes from "../modules/pool-bookings/poolBooking.routes";
import hallBookingRoutes from "../modules/hall-bookings/hallBooking.routes";
import publicFormRoutes from "../modules/public-forms/publicForms.routes";
import publicListingRoutes from "../modules/listings/listing.publicRoutes";
import publicSettingsRoutes from "../modules/content/settings.publicRoutes";
import publicContentRoutes from "../modules/content/content.publicRoutes";

/**
 * Public API — paths match the existing frontend contract EXACTLY. Some live
 * under /api/... and some at the root; both are preserved here so no frontend
 * change is required.
 */
const router = Router();

// /api/auth/send-otp
router.use("/api/auth", otpRoutes);
// /api/bookings/create-verified
router.use("/api/bookings", poolBookingRoutes);
// GET+POST /hall-bookings
router.use("/hall-bookings", hallBookingRoutes);
// POST /spa-bookings, /gym-memberships, /vendor-invites, /course-registrations, /contact-enquiries
router.use("/", publicFormRoutes);
// GET /listings
router.use("/listings", publicListingRoutes);
// GET /site-settings
router.use("/site-settings", publicSettingsRoutes);
// GET /banners, GET /gallery
router.use("/", publicContentRoutes);

export default router;
