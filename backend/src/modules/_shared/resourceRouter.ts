import { Router } from "express";
import { createResourceController, type ResourceConfig } from "./resourceController";
import { validate } from "../../middleware/validate";
import { idParamSchema, statusBodySchema, listQuerySchema } from "./commonSchemas";

/**
 * Standard admin sub-router for a collection:
 *   GET    /            list (paginate / search / filter / sort)
 *   GET    /:id         detail
 *   PATCH  /:id/status  update status
 *   DELETE /:id         delete
 */
export function buildResourceRouter(config: ResourceConfig): Router {
  const ctrl = createResourceController(config);
  const router = Router();

  router.get("/", validate({ query: listQuerySchema }), ctrl.list);
  router.get("/:id", validate({ params: idParamSchema }), ctrl.getOne);
  router.patch(
    "/:id/status",
    validate({ params: idParamSchema, body: statusBodySchema }),
    ctrl.updateStatus
  );
  router.delete("/:id", validate({ params: idParamSchema }), ctrl.remove);

  return router;
}
