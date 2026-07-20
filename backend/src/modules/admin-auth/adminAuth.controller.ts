import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/AppError";
import * as service from "./adminAuth.service";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const result = await service.login(email, password);
  return sendSuccess(res, result, "Logged in");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };
  const tokens = await service.refresh(refreshToken);
  return sendSuccess(res, tokens, "Token refreshed");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };
  await service.logout(refreshToken);
  return sendSuccess(res, null, "Logged out");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.admin) throw AppError.unauthorized();
  const admin = await prisma.adminUser.findUnique({
    where: { id: req.admin.sub },
    select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true },
  });
  if (!admin) throw AppError.notFound("Admin not found");
  return sendSuccess(res, admin, "Current admin");
});
