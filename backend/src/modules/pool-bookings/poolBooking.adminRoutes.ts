import { Router } from "express";
import { validate } from "../../middleware/validate";
import { adminBlockPoolBookingSchema } from "./poolBooking.schema";
import { createAdminPoolBooking, getPoolCalendar, getPoolMonth } from "./poolBooking.controller";

/**
 * Custom admin routes for pool bookings, mounted BEFORE the generic resource
 * router so these take precedence:
 *   GET  /api/admin/pool-bookings/calendar?date=  → both pools for a date
 *   POST /api/admin/pool-bookings                 → create / block (pool-aware)
 * List / detail / status / delete / edit come from the generic resource router.
 */
const router = Router();

router.get("/calendar", getPoolCalendar);
router.get("/month", getPoolMonth);
router.post("/", validate({ body: adminBlockPoolBookingSchema }), createAdminPoolBooking);

export default router;
