import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import { generateOtp, sendOtpSms } from "../../utils/otp";
import { sha256 } from "../../utils/hash";

const MAX_ATTEMPTS = 5;

/** Create + persist an OTP for a phone number and dispatch it via the provider. */
export async function issueOtp(phone: string, purpose = "pool_booking") {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + env.otp.expiryMinutes * 60 * 1000);

  await prisma.otpVerification.create({
    data: { phone, purpose, codeHash: sha256(code), expiresAt },
  });

  await sendOtpSms(phone, code);

  // Only surfaced in non-production when OTP_DEV_RETURN=true, for testing.
  return env.isProd || !env.otp.devReturn ? undefined : code;
}

/**
 * Verify an OTP for a phone. Consumes it on success. Throws AppError on any
 * failure (expired, wrong code, too many attempts, none pending).
 */
export async function verifyOtp(phone: string, code: string, purpose = "pool_booking") {
  const record = await prisma.otpVerification.findFirst({
    where: { phone, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!record) throw AppError.badRequest("No OTP request found. Please request a new code.");
  if (record.expiresAt < new Date()) throw AppError.badRequest("OTP has expired. Please request a new code.");
  if (record.attempts >= MAX_ATTEMPTS) throw AppError.tooMany("Too many incorrect attempts. Request a new code.");

  if (record.codeHash !== sha256(code)) {
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw AppError.badRequest("Incorrect OTP.");
  }

  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });
}
