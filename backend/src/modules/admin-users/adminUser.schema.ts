import { z } from "zod";

const roles = ["SUPER_ADMIN", "ADMIN", "STAFF"] as const;

export const createAdminSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(roles).optional(),
});

export const updateAdminSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(roles).optional(),
  isActive: z.boolean().optional(),
});
