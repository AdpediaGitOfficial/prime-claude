import crypto from "node:crypto";
import { env } from "../config/env";

/** Generate a numeric OTP of the configured length. */
export function generateOtp(): string {
  const length = env.otp.length;
  const max = 10 ** length;
  const num = crypto.randomInt(0, max);
  return num.toString().padStart(length, "0");
}

/**
 * Pluggable SMS delivery. Selected via OTP_PROVIDER:
 *  - "console" (default/dev): logs the OTP to the server console.
 *  - "msg91" / "twilio": call the provider. Left as clearly-marked stubs so
 *    credentials + the HTTP call can be dropped in without touching callers.
 *
 * Returns nothing — throws on hard delivery failure.
 */
export async function sendOtpSms(phone: string, code: string): Promise<void> {
  switch (env.otp.provider) {
    case "msg91":
      await sendViaMsg91(phone, code);
      return;
    case "twilio":
      await sendViaTwilio(phone, code);
      return;
    case "console":
    default:
      // eslint-disable-next-line no-console
      console.log(`[OTP] → ${phone}: ${code} (provider=console)`);
      return;
  }
}

async function sendViaMsg91(phone: string, code: string): Promise<void> {
  const { authKey, templateId } = env.otp.msg91;
  if (!authKey || !templateId) {
    throw new Error("MSG91 is selected but MSG91_AUTH_KEY / MSG91_TEMPLATE_ID are not set");
  }
  // TODO: implement the MSG91 OTP HTTP call with the project's approved template.
  // Kept as an explicit stub so switching providers is a config + this-function change only.
  const res = await fetch("https://control.msg91.com/api/v5/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json", authkey: authKey },
    body: JSON.stringify({ template_id: templateId, mobile: phone.replace("+", ""), otp: code }),
  });
  if (!res.ok) {
    throw new Error(`MSG91 send failed (${res.status})`);
  }
}

async function sendViaTwilio(phone: string, code: string): Promise<void> {
  const { accountSid, authToken, fromNumber } = env.otp.twilio;
  if (!accountSid || !authToken || !fromNumber) {
    throw new Error("Twilio is selected but its credentials are not set");
  }
  const body = new URLSearchParams({
    To: phone,
    From: fromNumber,
    Body: `Your Prime Promenade verification code is ${code}`,
  });
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      },
      body: body.toString(),
    }
  );
  if (!res.ok) {
    throw new Error(`Twilio send failed (${res.status})`);
  }
}
