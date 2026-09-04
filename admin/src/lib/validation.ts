/**
 * Shared form validation for admin data-entry forms (offline bookings, etc.).
 *
 * Name  — letters (any language), spaces and the usual name punctuation
 *         ( . ' - ) only. No digits, no other special characters.
 * Phone — exactly 10 digits, Indian mobile format (starts 6-9).
 */

const NAME_RE = /^\p{L}[\p{L}\s.'-]*$/u;
const PHONE_RE = /^[6-9]\d{9}$/;

export const NAME_ERROR = "Please enter a valid name (letters only).";
export const PHONE_ERROR = "Enter a valid 10-digit mobile number.";

/** True when the name has ≥ 2 letters and no digits / stray symbols. */
export function isValidName(value: string): boolean {
  const v = value.trim();
  const letters = (v.match(/\p{L}/gu) ?? []).length;
  return letters >= 2 && NAME_RE.test(v);
}

/** Exactly 10 digits, starting 6-9. */
export function isValidPhone(value: string): boolean {
  return PHONE_RE.test(value.trim());
}

/** Strip characters that are never allowed in a name (digits, most symbols). */
export function sanitizeName(value: string): string {
  return value.replace(/[^\p{L}\s.'-]/gu, "");
}

/** Keep digits only, capped at 10 (for a 10-digit mobile number). */
export function sanitizePhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}
