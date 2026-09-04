import { Router } from "express";
import { getPublicSettings } from "./settings.controller";

const router = Router();

/**
 * @openapi
 * /site-settings:
 *   get:
 *     tags: [Public - Settings]
 *     summary: Public site settings (contact details, social links)
 *     responses:
 *       200: { description: "{ key: value } map" }
 */
router.get("/", getPublicSettings);

export default router;
