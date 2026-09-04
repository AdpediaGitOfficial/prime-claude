import { Router } from "express";
import { validate } from "../../middleware/validate";
import { createHallBookingSchema } from "./hallBooking.schema";
import { listPublicHallBookings, createHallBooking } from "./hallBooking.controller";

const router = Router();

/**
 * @openapi
 * /hall-bookings:
 *   get:
 *     tags: [Public - Bookings]
 *     summary: List booked hall dates (for calendar availability)
 *     responses:
 *       200: { description: Array of bookings with date }
 *   post:
 *     tags: [Public - Bookings]
 *     summary: Create a conference/hall booking request
 *     responses:
 *       201: { description: Booking created }
 */
router.get("/", listPublicHallBookings);
router.post("/", validate({ body: createHallBookingSchema }), createHallBooking);

export default router;
