import { Router } from "express";
import { validate } from "../../middleware/validate";
import { strictLimiter } from "../../middleware/rateLimit";
import { authGuard } from "../../middleware/auth";
import { loginSchema, refreshSchema } from "./adminAuth.schema";
import * as ctrl from "./adminAuth.controller";

const router = Router();

/**
 * @openapi
 * /api/admin/auth/login:
 *   post:
 *     tags: [Admin - Auth]
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Access + refresh tokens }
 *       401: { description: Invalid credentials }
 */
router.post("/login", strictLimiter, validate({ body: loginSchema }), ctrl.login);
router.post("/refresh", validate({ body: refreshSchema }), ctrl.refresh);
router.post("/logout", validate({ body: refreshSchema }), ctrl.logout);
router.get("/me", authGuard, ctrl.me);

export default router;
