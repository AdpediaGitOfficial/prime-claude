import type { Response } from "express";

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/** Standard success envelope used by all ADMIN endpoints. */
export function sendSuccess(
  res: Response,
  data: unknown,
  message = "OK",
  statusCode = 200,
  meta?: PageMeta
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function buildPageMeta(total: number, page: number, limit: number): PageMeta {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
