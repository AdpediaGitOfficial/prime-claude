import { Router } from "express";
import { validate } from "../../middleware/validate";
import { publicListingsQuerySchema } from "./listing.schema";
import { listPublicListings } from "./listing.controller";

const router = Router();

/**
 * @openapi
 * /listings:
 *   get:
 *     tags: [Public - Listings]
 *     summary: List active listings (optionally by type) — powers availability
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [POOL, HALL, SPA_SERVICE, GYM_PLAN, VENDOR_COUNTER, COURSE] }
 *     responses:
 *       200: { description: Array of listings }
 */
router.get("/", validate({ query: publicListingsQuerySchema }), listPublicListings);

export default router;
