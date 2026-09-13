import crypto from "node:crypto";
import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess, buildPageMeta } from "../../utils/apiResponse";
import { AppError } from "../../utils/AppError";
import { hashPassword } from "../../utils/hash";
import { recordAudit } from "../../utils/audit";

const publicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
} as const;

/** Parse ?page/?limit with sane caps (1-based page, ≤100 rows). */
function pageParams(req: Request) {
  const page = Math.max(1, Number.parseInt(String(req.query.page ?? "1"), 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit ?? "25"), 10) || 25));
  return { page, limit, skip: (page - 1) * limit };
}

/**
 * Generate a strong, human-transcribable one-time password (no ambiguous
 * 0/O/1/l/I) with at least one lower, upper and digit. Used for admin-set
 * password resets; shown to the SUPER_ADMIN once and never stored in plaintext.
 */
function generatePassword(length = 14): string {
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digit = "23456789";
  const all = lower + upper + digit;
  const pick = (set: string) => set[crypto.randomInt(set.length)];
  const chars = [pick(lower), pick(upper), pick(digit)];
  for (let i = chars.length; i < length; i++) chars.push(pick(all));
  // Fisher–Yates shuffle so the required classes aren't always in front.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

/** Block changes that would leave the system with no active SUPER_ADMIN. */
async function assertNotLastSuperAdmin(targetId: string) {
  const target = await prisma.adminUser.findUnique({ where: { id: targetId } });
  if (!target || target.role !== "SUPER_ADMIN" || !target.isActive) return;
  const activeSupers = await prisma.adminUser.count({
    where: { role: "SUPER_ADMIN", isActive: true },
  });
  if (activeSupers <= 1) {
    throw AppError.badRequest("Cannot remove or demote the last active super admin.");
  }
}

/** Revoke every live refresh token for an admin (forces re-login). */
async function revokeSessions(adminId: string) {
  await prisma.refreshToken.updateMany({
    where: { adminId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export const listAdmins = asyncHandler(async (_req: Request, res: Response) => {
  const admins = await prisma.adminUser.findMany({
    select: publicSelect,
    orderBy: { createdAt: "desc" },
  });
  return sendSuccess(res, admins, "Admin users");
});

export const createAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role?: "SUPER_ADMIN" | "ADMIN" | "STAFF";
  };

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) throw AppError.badRequest("An account with this email already exists.");

  const passwordHash = await hashPassword(password);
  const admin = await prisma.adminUser.create({
    data: { name, email, passwordHash, role: role ?? "ADMIN" },
    select: publicSelect,
  });
  recordAudit(req, "create", "Admin user", admin.id, { email: admin.email, role: admin.role });
  return sendSuccess(res, admin, "Admin created", 201);
});

export const updateAdmin = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.adminUser.findUnique({ where: { id: req.params.id } });
  if (!existing) throw AppError.notFound("Admin not found");

  const body = req.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: "SUPER_ADMIN" | "ADMIN" | "STAFF";
    isActive?: boolean;
  };

  // Guardrails: don't lock yourself out; keep at least one active super admin.
  if (req.admin?.sub === req.params.id && body.isActive === false) {
    throw AppError.badRequest("You cannot deactivate your own account.");
  }
  if (req.admin?.sub === req.params.id && body.role && body.role !== existing.role) {
    throw AppError.badRequest("You cannot change your own role.");
  }
  const demoting = body.role !== undefined && body.role !== "SUPER_ADMIN";
  const deactivating = body.isActive === false;
  if (demoting || deactivating) await assertNotLastSuperAdmin(req.params.id);

  if (body.email && body.email !== existing.email) {
    const clash = await prisma.adminUser.findUnique({ where: { email: body.email } });
    if (clash) throw AppError.badRequest("An account with this email already exists.");
  }

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.email !== undefined) data.email = body.email;
  if (body.role !== undefined) data.role = body.role;
  if (body.isActive !== undefined) data.isActive = body.isActive;
  if (body.password) data.passwordHash = await hashPassword(body.password);

  const admin = await prisma.adminUser.update({
    where: { id: req.params.id },
    data,
    select: publicSelect,
  });

  // If the account was deactivated or its password changed, kill live sessions.
  if (deactivating || body.password) await revokeSessions(req.params.id);

  recordAudit(req, "update", "Admin user", admin.id, {
    changed: Object.keys(data).map((k) => (k === "passwordHash" ? "password" : k)),
  });
  return sendSuccess(res, admin, "Admin updated");
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.adminUser.findUnique({ where: { id: req.params.id } });
  if (!existing) throw AppError.notFound("Admin not found");

  // Use the provided password, or generate a strong one to hand over.
  const { password } = (req.body ?? {}) as { password?: string };
  const newPassword = password && password.length >= 8 ? password : generatePassword();

  await prisma.adminUser.update({
    where: { id: req.params.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });
  await revokeSessions(req.params.id);

  recordAudit(req, "reset-password", "Admin user", req.params.id, { email: existing.email });
  // The plaintext is returned exactly once; it is never persisted in the clear.
  return sendSuccess(res, { id: req.params.id, password: newPassword }, "Password reset");
});

export const deleteAdmin = asyncHandler(async (req: Request, res: Response) => {
  if (req.admin?.sub === req.params.id) {
    throw AppError.badRequest("You cannot delete your own account");
  }
  const existing = await prisma.adminUser.findUnique({ where: { id: req.params.id } });
  if (!existing) throw AppError.notFound("Admin not found");
  await assertNotLastSuperAdmin(req.params.id);

  await prisma.adminUser.delete({ where: { id: req.params.id } });
  recordAudit(req, "delete", "Admin user", req.params.id, { email: existing.email });
  return sendSuccess(res, { id: req.params.id }, "Admin deleted");
});

export const listLoginEvents = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = pageParams(req);
  const where: Record<string, unknown> = {};
  if (req.query.adminId) where.adminId = String(req.query.adminId);
  if (req.query.success === "true") where.success = true;
  if (req.query.success === "false") where.success = false;

  const [items, total] = await Promise.all([
    prisma.loginEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { admin: { select: { id: true, name: true, email: true } } },
    }),
    prisma.loginEvent.count({ where }),
  ]);
  return sendSuccess(res, items, "Login events", 200, buildPageMeta(total, page, limit));
});

export const listAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = pageParams(req);
  const where: Record<string, unknown> = {};
  if (req.query.adminId) where.adminId = String(req.query.adminId);
  if (req.query.entity) where.entity = String(req.query.entity);
  if (req.query.action) where.action = String(req.query.action);

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { admin: { select: { id: true, name: true, email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);
  return sendSuccess(res, items, "Audit logs", 200, buildPageMeta(total, page, limit));
});
