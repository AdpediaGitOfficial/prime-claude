import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { issueOtp } from "./otp.service";

/**
 * POST /api/auth/send-otp
 * Public — called by the pool-booking flow before creating a verified booking.
 */
export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone, purpose } = req.body as { phone: string; purpose?: string };
  const devOtp = await issueOtp(phone, purpose ?? "pool_booking");

  return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    ...(devOtp ? { devOtp } : {}),
  });
});
