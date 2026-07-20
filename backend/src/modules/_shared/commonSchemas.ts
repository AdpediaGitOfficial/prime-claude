import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().min(1, "id is required"),
});

export const statusBodySchema = z.object({
  status: z.string().min(1, "status is required"),
});

/** Query schema for admin list endpoints (all optional; parsed loosely). */
export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});
