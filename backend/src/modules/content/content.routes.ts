import { Router } from "express";
import { validate } from "../../middleware/validate";
import { createCrudController } from "./content.crud";
import { idParamSchema, listQuerySchema } from "../_shared/commonSchemas";
import {
  createPageSchema,
  updatePageSchema,
  createBannerSchema,
  updateBannerSchema,
  createGallerySchema,
  updateGallerySchema,
  upsertSettingSchema,
} from "./content.schema";
import * as settings from "./settings.controller";

const router = Router();

/** Mount full CRUD for a content collection under a base path. */
function mountCrud(
  base: string,
  ctrl: ReturnType<typeof createCrudController>,
  createSchema: Parameters<typeof validate>[0]["body"],
  updateSchema: Parameters<typeof validate>[0]["body"]
) {
  router.get(`/${base}`, validate({ query: listQuerySchema }), ctrl.list);
  router.get(`/${base}/:id`, validate({ params: idParamSchema }), ctrl.getOne);
  router.post(`/${base}`, validate({ body: createSchema }), ctrl.create);
  router.put(`/${base}/:id`, validate({ params: idParamSchema, body: updateSchema }), ctrl.update);
  router.delete(`/${base}/:id`, validate({ params: idParamSchema }), ctrl.remove);
}

mountCrud(
  "pages",
  createCrudController({ model: "page", label: "Page", searchFields: ["slug", "title"], sortFields: ["createdAt", "title", "slug"] }),
  createPageSchema,
  updatePageSchema
);

mountCrud(
  "banners",
  createCrudController({ model: "banner", label: "Banner", searchFields: ["location", "title"], sortFields: ["createdAt", "order", "location"] }),
  createBannerSchema,
  updateBannerSchema
);

mountCrud(
  "gallery",
  createCrudController({ model: "galleryImage", label: "Gallery image", searchFields: ["title", "category"], sortFields: ["createdAt", "order", "category"] }),
  createGallerySchema,
  updateGallerySchema
);

// ─── Settings (key-based) ───
router.get("/settings", settings.listSettings);
router.get("/settings/:key", settings.getSetting);
router.put("/settings/:key", validate({ body: upsertSettingSchema }), settings.upsertSetting);
router.delete("/settings/:key", settings.deleteSetting);

export default router;
