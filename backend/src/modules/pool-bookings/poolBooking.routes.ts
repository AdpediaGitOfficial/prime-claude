import { Router } from "express";
import { validate } from "../../middleware/validate";
import { strictLimiter } from "../../middleware/rateLimit";
import { createPoolBookingSchema } from "./poolBooking.schema";
import { createVerifiedPoolBooking } from "./poolBooking.controller";

const router = Router();

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
