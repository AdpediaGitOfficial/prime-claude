import { Router } from "express";
import * as ctrl from "./dashboard.controller";

const router = Router();

/**
 * @openapi
 * /api/admin/dashboard/stats:
 *   get:
 *     tags: [Admin - Dashboard]
 *     summary: Booking & enquiry statistics
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Stats } }
 * /api/admin/dashboard/analytics:
 *   get:
 *     tags: [Admin - Dashboard]
 *     summary: Daily time-series of bookings/enquiries
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: range
 *         schema: { type: integer, default: 30 }
 *     responses: { 200: { description: Analytics series } }
 */
router.get("/stats", ctrl.stats);
router.get("/analytics", ctrl.analytics);

export default router;
