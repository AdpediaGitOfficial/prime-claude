import { z } from "zod";

// ─── Pages ───
export const createPageSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  isPublished: z.boolean().optional(),
});
export const updatePageSchema = createPageSchema.partial();

// ─── Banners ───
export const createBannerSchema = z.object({
  location: z.string().trim().min(1),
  title: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  imagePath: z.string().trim().optional(),
  ctaLabel: z.string().trim().optional(),
  ctaHref: z.string().trim().optional(),
  order: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});
export const updateBannerSchema = createBannerSchema.partial();

// ─── Gallery ───
export const createGallerySchema = z.object({
  title: z.string().trim().optional(),
  imagePath: z.string().trim().min(1, "imagePath is required"),
  category: z.string().trim().optional(),
  order: z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
});
export const updateGallerySchema = createGallerySchema.partial();

// ─── Settings ───
export const upsertSettingSchema = z.object({
  value: z.unknown(),
  group: z.string().trim().optional(),
});
