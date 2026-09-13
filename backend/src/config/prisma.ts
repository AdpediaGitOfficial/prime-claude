import { PrismaClient } from "@prisma/client";
import { env } from "./env";

/**
 * A single shared PrismaClient instance. In development we cache it on the
 * global object so hot-reloading (ts-node-dev) doesn't exhaust the connection
 * pool by creating a new client on every reload.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isProd ? ["error"] : ["warn", "error"],
  });

if (!env.isProd) {
  globalForPrisma.prisma = prisma;
}
