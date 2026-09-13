import bcrypt from "bcryptjs";
import crypto from "node:crypto";

const SALT_ROUNDS = 10;

export const hashPassword = (plain: string) => bcrypt.hash(plain, SALT_ROUNDS);
export const comparePassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

/** Deterministic SHA-256 — used to store OTP codes and refresh tokens at rest. */
export const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");
