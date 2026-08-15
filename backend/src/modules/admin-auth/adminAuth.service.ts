import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";
import { comparePassword, sha256 } from "../../utils/hash";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

function refreshExpiryDate(): Date {
  // Mirror JWT_REFRESH_EXPIRES_IN loosely for DB bookkeeping (default 7d).
  const days = Number.parseInt(env.jwt.refreshExpiresIn, 10) || 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function issueTokens(admin: { id: string; email: string; role: string }) {
  const accessToken = signAccessToken({ sub: admin.id, email: admin.email, role: admin.role });
  const refreshToken = signRefreshToken({ sub: admin.id });

  await prisma.refreshToken.create({
    data: {
      adminId: admin.id,
      tokenHash: sha256(refreshToken),
      expiresAt: refreshExpiryDate(),
    },
  });

  return { accessToken, refreshToken };
}

// A valid bcrypt hash of a random value — compared against when the account
// does not exist so login timing does not reveal which emails are registered.
const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8Q2xj0Q1r9mS6bWQwZ8b7l8m6oXeK";

export async function login(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  // Always run a bcrypt comparison (real or dummy) to keep timing constant
  // and avoid user enumeration via response time.
  const ok = await comparePassword(password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !admin.isActive || !ok) throw AppError.unauthorized("Invalid credentials");

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = await issueTokens(admin);
  return {
    ...tokens,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  };
}

export async function refresh(refreshToken: string) {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw AppError.unauthorized("Invalid or expired refresh token");
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: sha256(refreshToken) },
  });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw AppError.unauthorized("Refresh token is no longer valid");
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: payload.sub } });
  if (!admin || !admin.isActive) throw AppError.unauthorized("Account is not active");

  // Rotate: revoke the used token, issue a fresh pair.
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  return issueTokens(admin);
}

export async function logout(refreshToken: string) {
  await prisma.refreshToken.updateMany({
    where: { tokenHash: sha256(refreshToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
