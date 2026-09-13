import { Router } from "express";
import { validate } from "../../middleware/validate";
import { idParamSchema } from "../_shared/commonSchemas";
import {
  createListingSchema,
  updateListingSchema,
  availabilitySchema,
} from "./listing.schema";
import * as ctrl from "./listing.controller";

const router = Router();

/**
 * @openapi
 * /api/admin/listings:
 *   get: { tags: [Admin - Listings], summary: List listings, security: [{ bearerAuth: [] }], responses: { 200: { description: OK } } }
 *   post: { tags: [Admin - Listings], summary: Create listing, security: [{ bearerAuth: [] }], responses: { 201: { description: Created } } }
 */
router.get("/", ctrl.adminListListings);
router.get("/:id", validate({ params: idParamSchema }), ctrl.adminGetListing);
router.post("/", validate({ body: createListingSchema }), ctrl.adminCreateListing);
router.put("/:id", validate({ params: idParamSchema, body: updateListingSchema }), ctrl.adminUpdateListing);
router.patch("/:id/availability", validate({ params: idParamSchema, body: availabilitySchema }), ctrl.adminSetAvailability);
router.delete("/:id", validate({ params: idParamSchema }), ctrl.adminDeleteListing);

export default router;
