import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/AppError";
import { hashPassword } from "../../utils/hash";

const publicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
} as const;

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
  const passwordHash = await hashPassword(password);
  const admin = await prisma.adminUser.create({
    data: { name, email, passwordHash, role: role ?? "ADMIN" },
    select: publicSelect,
  });
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
  return sendSuccess(res, admin, "Admin updated");
});

export const deleteAdmin = asyncHandler(async (req: Request, res: Response) => {
  if (req.admin?.sub === req.params.id) {
    throw AppError.badRequest("You cannot delete your own account");
  }
  const existing = await prisma.adminUser.findUnique({ where: { id: req.params.id } });
  if (!existing) throw AppError.notFound("Admin not found");
  await prisma.adminUser.delete({ where: { id: req.params.id } });
  return sendSuccess(res, { id: req.params.id }, "Admin deleted");
});
