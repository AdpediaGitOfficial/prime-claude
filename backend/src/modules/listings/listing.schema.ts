import { z } from "zod";

export const listingTypes = [
  "POOL",
  "HALL",
  "SPA_SERVICE",
  "GYM_PLAN",
  "VENDOR_COUNTER",
  "COURSE",
] as const;

export const publicListingsQuerySchema = z.object({
  type: z.enum(listingTypes).optional(),
});

export const createListingSchema = z.object({
  type: z.enum(listingTypes),
  name: z.string().trim().min(1),
  code: z.string().trim().optional(),
  description: z.string().trim().optional(),
  price: z.coerce.number().int().nonnegative().optional(),
  durationLabel: z.string().trim().optional(),
  capacity: z.coerce.number().int().nonnegative().optional(),
  isAvailable: z.boolean().optional(),
  isActive: z.boolean().optional(),
  order: z.coerce.number().int().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const updateListingSchema = createListingSchema.partial();

export const availabilitySchema = z.object({
  isAvailable: z.boolean(),
});
