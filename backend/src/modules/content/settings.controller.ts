import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { AppError } from "../../utils/AppError";

/** GET /api/admin/settings — all site settings. */
export const listSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  return sendSuccess(res, settings, "Site settings");
});

/**
 * GET /site-settings — PUBLIC. Returns a { key: value } map the frontend
 * consumes for contact details, social links, etc. Raw shape (no envelope).
 */
export const getPublicSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, unknown> = {};
  for (const s of settings) map[s.key] = s.value;
  return res.status(200).json(map);
});

/** GET /api/admin/settings/:key */
export const getSetting = asyncHandler(async (req: Request, res: Response) => {
  const setting = await prisma.siteSetting.findUnique({ where: { key: req.params.key } });
  if (!setting) throw AppError.notFound("Setting not found");
  return sendSuccess(res, setting, "Setting detail");
});

/** PUT /api/admin/settings/:key — upsert a setting by key. */
export const upsertSetting = asyncHandler(async (req: Request, res: Response) => {
  const { value, group } = req.body as { value: unknown; group?: string };
  const setting = await prisma.siteSetting.upsert({
    where: { key: req.params.key },
    update: { value: value as object, ...(group ? { group } : {}) },
    create: { key: req.params.key, value: value as object, group: group ?? "general" },
  });
  return sendSuccess(res, setting, "Setting saved");
});

/** DELETE /api/admin/settings/:key */
export const deleteSetting = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.siteSetting.findUnique({ where: { key: req.params.key } });
  if (!existing) throw AppError.notFound("Setting not found");
  await prisma.siteSetting.delete({ where: { key: req.params.key } });
  return sendSuccess(res, { key: req.params.key }, "Setting deleted");
});
