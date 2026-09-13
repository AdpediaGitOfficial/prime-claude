import { Router } from "express";
import type { Request, Response } from "express";
import { env } from "../../config/env";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { sendSuccess } from "../../utils/apiResponse";
import { upload } from "./upload.middleware";

const router = Router();

/**
 * @openapi
 * /api/admin/uploads:
 *   post:
 *     tags: [Admin - Uploads]
 *     summary: Upload a file (image/pdf) to local storage
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: string, format: binary }
 *     responses:
 *       201: { description: File stored, returns public URL }
 */
router.post(
  "/",
  upload.single("file"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw AppError.badRequest("No file provided (field name: 'file')");
    const relativePath = `/${env.uploadDir}/${req.file.filename}`;
    return sendSuccess(
      res,
      {
        filename: req.file.filename,
        path: relativePath,
        url: `${env.publicBaseUrl}${relativePath}`,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      "File uploaded",
      201
    );
  })
);

export default router;
