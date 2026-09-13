import type { Request } from "express";

export interface ListQuery {
  page: number;
  limit: number;
  skip: number;
  search: string;
  sortBy: string;
  sortDir: "asc" | "desc";
  status?: string;
  from?: string;
  to?: string;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parse the common list-query params shared by every admin collection endpoint:
 * pagination, free-text search, status filter, date range and sorting.
 */
export function parseListQuery(req: Request, allowedSortFields: string[]): ListQuery {
  const q = req.query;

  const page = Math.max(1, Number.parseInt(String(q.page ?? "1"), 10) || 1);
  const rawLimit = Number.parseInt(String(q.limit ?? DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
  const limit = Math.min(MAX_LIMIT, Math.max(1, rawLimit));

  const requestedSort = String(q.sortBy ?? "createdAt");
  const sortBy = allowedSortFields.includes(requestedSort) ? requestedSort : "createdAt";
  const sortDir = String(q.sortDir ?? "desc").toLowerCase() === "asc" ? "asc" : "desc";

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    search: String(q.search ?? "").trim(),
    sortBy,
    sortDir,
    status: q.status ? String(q.status).trim() : undefined,
    from: q.from ? String(q.from).trim() : undefined,
    to: q.to ? String(q.to).trim() : undefined,
  };
}

/** Build a Prisma OR filter that matches `search` across the given fields. */
export function buildSearchFilter(search: string, fields: string[]) {
  if (!search) return undefined;
  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" as const },
    })),
  };
}

/** Build a createdAt range filter from `from`/`to` (inclusive). */
export function buildDateRangeFilter(from?: string, to?: string) {
  if (!from && !to) return undefined;
  const range: { gte?: Date; lte?: Date } = {};
  if (from) {
    const d = new Date(from);
    if (!Number.isNaN(d.getTime())) range.gte = d;
  }
  if (to) {
    const d = new Date(to);
    if (!Number.isNaN(d.getTime())) {
      // Make `to` inclusive of the whole day.
      d.setHours(23, 59, 59, 999);
      range.lte = d;
    }
  }
  return Object.keys(range).length ? { createdAt: range } : undefined;
}
