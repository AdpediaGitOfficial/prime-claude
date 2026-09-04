import { Router } from "express";
import { authGuard } from "../middleware/auth";
import { buildResourceRouter } from "../modules/_shared/resourceRouter";
import { RESOURCES } from "../modules/_shared/resources";
import adminAuthRoutes from "../modules/admin-auth/adminAuth.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import contentRoutes from "../modules/content/content.routes";
import listingAdminRoutes from "../modules/listings/listing.adminRoutes";
import uploadRoutes from "../modules/uploads/upload.routes";
import adminUserRoutes from "../modules/admin-users/adminUser.routes";
import poolAdminRoutes from "../modules/pool-bookings/poolBooking.adminRoutes";

/** Admin API — everything under /api/admin. */
const router = Router();

// Auth endpoints are public (login/refresh/logout); /me guards itself.
router.use("/auth", adminAuthRoutes);

// Everything below requires a valid admin access token.
router.use(authGuard);

router.use("/dashboard", dashboardRoutes);

// Pool-specific admin routes (calendar + pool-aware create/block) take
// precedence over the generic pool-bookings router mounted in the loop below.
router.use("/pool-bookings", poolAdminRoutes);

// One REST router per booking/enquiry collection (list/get/status/delete).
for (const cfg of Object.values(RESOURCES)) {
  router.use(`/${cfg.path}`, buildResourceRouter(cfg));
}

// Content management: /pages, /banners, /gallery, /settings
router.use("/", contentRoutes);

// Listings & availability
router.use("/listings", listingAdminRoutes);

// File uploads
router.use("/uploads", uploadRoutes);

// Admin user management (SUPER_ADMIN only, enforced inside)
router.use("/admins", adminUserRoutes);

export default router;
