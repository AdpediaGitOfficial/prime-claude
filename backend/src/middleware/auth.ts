import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken, type AccessTokenPayload } from "../utils/jwt";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AccessTokenPayload;
    }
  }
}

/** Require a valid admin access token (Bearer). Attaches req.admin. */
export function authGuard(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw AppError.unauthorized("Missing or malformed Authorization header");
  }

  try {
    req.admin = verifyAccessToken(token);
    next();
  } catch {
    throw AppError.unauthorized("Invalid or expired token");
  }
}

/** Restrict a route to specific admin roles. Use after authGuard. */
export function roleGuard(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin) throw AppError.unauthorized();
    if (roles.length && !roles.includes(req.admin.role)) {
      throw AppError.forbidden("You do not have permission to perform this action");
    }
    next();
  };
}
