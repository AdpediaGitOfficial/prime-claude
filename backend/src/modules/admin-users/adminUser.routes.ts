import { Router } from "express";
import { validate } from "../../middleware/validate";
import { roleGuard } from "../../middleware/auth";
import { idParamSchema } from "../_shared/commonSchemas";
import { createAdminSchema, updateAdminSchema } from "./adminUser.schema";
import * as ctrl from "./adminUser.controller";

const router = Router();

// All admin-user management is restricted to SUPER_ADMIN.
router.use(roleGuard("SUPER_ADMIN"));

/**
 * @openapi
 * /api/admin/admins:
 *   get: { tags: [Admin - Users], summary: List admin users, security: [{ bearerAuth: [] }], responses: { 200: { description: OK } } }
 *   post: { tags: [Admin - Users], summary: Create admin user, security: [{ bearerAuth: [] }], responses: { 201: { description: Created } } }
 */
router.get("/", ctrl.listAdmins);
router.post("/", validate({ body: createAdminSchema }), ctrl.createAdmin);
router.put("/:id", validate({ params: idParamSchema, body: updateAdminSchema }), ctrl.updateAdmin);
router.delete("/:id", validate({ params: idParamSchema }), ctrl.deleteAdmin);

export default router;
