import { Router } from "express";
import { validate } from "../../middleware/validate";
import { strictLimiter } from "../../middleware/rateLimit";
import { createPoolBookingSchema, createDirectPoolBookingSchema } from "./poolBooking.schema";
import {
  createVerifiedPoolBooking,
  createDirectPoolBooking,
  getPoolAvailability,
} from "./poolBooking.controller";

const router = Router();
export const directPoolBookingRouter = Router();

/**
 * @openapi
 * /pool-bookings:
 *   post:
 *     tags: [Public - Bookings]
 *     summary: Create a pool booking directly (no OTP)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guest, phone, poolType, date, timeSlot]
 *             properties:
 *               guest: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               poolType: { type: string }
 *               date: { type: string, example: "2026-07-25" }
 *               timeSlot: { type: string, example: "10:00 AM - 11:30 AM" }
 *               addons: { type: array, items: { type: string } }
 *               totalAmount: { type: integer }
 *     responses:
 *       201: { description: Booking created }
 */
directPoolBookingRouter.post(
  "/",
  strictLimiter,
  validate({ body: createDirectPoolBookingSchema }),
  createDirectPoolBooking
);

/**
 * @openapi
 * /pool-bookings:
 *   get:
 *     tags: [Public - Bookings]
 *     summary: Occupied pool intervals for a date (drives slot availability)
 *     parameters:
 *       - in: query
 *         name: date
 *         schema: { type: string, example: "2026-07-25" }
 *     responses:
 *       200: { description: "{ capacity, occupied: [{ start, end }] } (minutes since midnight)" }
 */
directPoolBookingRouter.get("/", getPoolAvailability);

/**
 * @openapi
 * /api/bookings/create-verified:
 *   post:
 *     tags: [Public - Bookings]
 *     summary: Create a pool booking after OTP verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guest, phone, otp, poolType, date, timeSlot]
 *             properties:
 *               guest: { type: string }
 *               phone: { type: string }
 *               otp: { type: string }
 *               poolType: { type: string }
 *               date: { type: string, example: "2026-07-25" }
 *               timeSlot: { type: string, example: "10:00 AM - 11:30 AM" }
 *               addons: { type: array, items: { type: string } }
 *               totalAmount: { type: integer }
 *     responses:
 *       201: { description: Booking created }
 *       400: { description: OTP invalid/expired }
 */
router.post(
  "/create-verified",
  strictLimiter,
  validate({ body: createPoolBookingSchema }),
  createVerifiedPoolBooking
);

export default router;
