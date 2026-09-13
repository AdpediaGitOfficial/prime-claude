import { z } from "zod";

/**
 * A URL-ish string that rejects script-capable schemes (javascript:, data:,
 * vbscript:, file:, blob:). Allows http(s)/mailto/tel and scheme-less
 * (relative/anchor) values. Prevents stored-XSS payloads in CMS link fields.
 */
export const safeHref = z
  .string()
  .trim()
  .refine((v) => {
    if (!v) return true;
    const deobf = Array.from(v)
      .filter((ch) => ch.charCodeAt(0) > 0x20)
      .join("")
      .toLowerCase();
    if (/^(javascript|data|vbscript|file|blob):/.test(deobf)) return false;
    if (/^(https?:|mailto:|tel:)/i.test(v)) return true;
    // any other explicit scheme → reject; scheme-less (relative/anchor) → allow
    return !/^[a-z][a-z0-9+.-]*:/.test(deobf);
  }, "Unsafe URL scheme")
  .optional();

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
  ctaHref: safeHref,
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
