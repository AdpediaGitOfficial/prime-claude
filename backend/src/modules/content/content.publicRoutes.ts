import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

/**
 * @openapi
 * /banners:
 *   get:
 *     tags: [Public - Content]
 *     summary: Active banners (optionally by location)
 *     parameters:
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *     responses: { 200: { description: Array of banners } }
 */
router.get(
  "/banners",
  asyncHandler(async (req: Request, res: Response) => {
    const { location } = req.query;
    const banners = await prisma.banner.findMany({
      where: { isActive: true, ...(location ? { location: String(location) } : {}) },
      orderBy: { order: "asc" },
    });
    return res.status(200).json(banners);
  })
);

/**
 * @openapi
 * /gallery:
 *   get:
 *     tags: [Public - Content]
 *     summary: Active gallery images
 *     responses: { 200: { description: Array of gallery images } }
 */
router.get(
  "/gallery",
  asyncHandler(async (_req: Request, res: Response) => {
    const gallery = await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return res.status(200).json(gallery);
  })
);

export default router;
