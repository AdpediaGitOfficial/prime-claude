import type { Request } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

/** Best-effort client IP. `trust proxy` is enabled, so req.ip already honours
 *  X-Forwarded-For; fall back to the socket address. */
export function clientIp(req: Request): string | undefined {
  return req.ip || req.socket?.remoteAddress || undefined;
}

export function userAgent(req: Request): string | undefined {
  const ua = req.headers["user-agent"];
  return typeof ua === "string" ? ua.slice(0, 512) : undefined;
}

/**
 * Record an admin action in the audit log. Fire-and-forget: auditing must never
 * break or slow the request it describes, so failures are swallowed. `adminId`
 * is taken from the authenticated request (null for unauthenticated contexts).
 */
export function recordAudit(
  req: Request,
  action: "create" | "update" | "status" | "delete" | "reset-password" | string,
  entity: string,
  entityId?: string | null,
  meta?: Record<string, unknown>,
): void {
  const adminId = req.admin?.sub ?? null;
  void prisma.auditLog
    .create({
      data: {
        adminId,
        action,
        entity,
        entityId: entityId ?? null,
        meta: meta ? (meta as Prisma.InputJsonValue) : undefined,
      },
    })
    .catch(() => {
      /* never surface audit failures to the caller */
    });
}
