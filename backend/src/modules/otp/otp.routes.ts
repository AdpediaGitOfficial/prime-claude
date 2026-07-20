import { Router } from "express";
import { validate } from "../../middleware/validate";
import { strictLimiter } from "../../middleware/rateLimit";
import { sendOtpSchema } from "./otp.schema";
import { sendOtp } from "./otp.controller";

const router = Router();

/**
 * @openapi
 * /api/auth/send-otp:
 *   post:
 *     tags: [Public - OTP]
 *     summary: Send an OTP to a phone number (pool booking verification)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone: { type: string, example: "+919876543210" }
 *     responses:
 *       200: { description: OTP sent }
 *       422: { description: Validation error }
 */
router.post("/send-otp", strictLimiter, validate({ body: sendOtpSchema }), sendOtp);

export default router;
