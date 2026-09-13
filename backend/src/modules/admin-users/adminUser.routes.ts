import { Router } from "express";
import { validate } from "../../middleware/validate";
import { roleGuard } from "../../middleware/auth";
import { idParamSchema } from "../_shared/commonSchemas";
import { createAdminSchema, updateAdminSchema, resetPasswordSchema } from "./adminUser.schema";
import * as ctrl from "./adminUser.controller";

const router = Router();

// All admin-user management is restricted to SUPER_ADMIN.
router.use(roleGuard("SUPER_ADMIN"));

/**
 * @openapi
 * /api/admin/admins:
 *   get: { tags: [Admin - Users], summary: List admin users, security: [{ bearerAuth: [] }], responses: { 200: { description: OK } } }
 *   post: { tags: [Admin - Users], summary: Create admin user, security: [{ bearerAuth: [] }], responses: { 201: { description: Created } } }
 * /api/admin/admins/login-events:
 *   get: { tags: [Admin - Users], summary: Admin login history, security: [{ bearerAuth: [] }], responses: { 200: { description: OK } } }
 * /api/admin/admins/audit-logs:
 *   get: { tags: [Admin - Users], summary: Admin action audit log, security: [{ bearerAuth: [] }], responses: { 200: { description: OK } } }
 */

// Monitoring views (literal paths — declared before the :id routes).
router.get("/login-events", ctrl.listLoginEvents);
router.get("/audit-logs", ctrl.listAuditLogs);

router.get("/", ctrl.listAdmins);
router.post("/", validate({ body: createAdminSchema }), ctrl.createAdmin);
router.put("/:id", validate({ params: idParamSchema, body: updateAdminSchema }), ctrl.updateAdmin);
router.post(
  "/:id/reset-password",
  validate({ params: idParamSchema, body: resetPasswordSchema }),
  ctrl.resetPassword,
);
router.delete("/:id", validate({ params: idParamSchema }), ctrl.deleteAdmin);

export default router;
