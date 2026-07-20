import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess, buildPageMeta } from "../../utils/apiResponse";
import {
  parseListQuery,
  buildSearchFilter,
  buildDateRangeFilter,
} from "../../utils/queryParser";

type PrismaDelegate = {
  findMany: (args: unknown) => Promise<unknown[]>;
  count: (args: unknown) => Promise<number>;
  findUnique: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
};

export interface ResourceConfig {
  /** Prisma model key on the client, e.g. "poolBooking". */
  model: keyof typeof prisma;
  /** Human label used in messages, e.g. "Pool booking". */
  label: string;
  /** Fields included in free-text search. */
  searchFields: string[];
  /** Fields allowed in ?sortBy=. */
  sortFields: string[];
  /** Allowed values for the status field (validates PATCH .../status). */
  allowedStatuses: string[];
}

/**
 * Build the standard admin handlers (list, getOne, updateStatus, remove) for a
 * collection. Every booking/enquiry resource reuses this so pagination, search,
 * filtering, sorting and status/delete behave identically everywhere.
 */
export function createResourceController(config: ResourceConfig) {
  const delegate = () => prisma[config.model] as unknown as PrismaDelegate;

  const list = asyncHandler(async (req: Request, res: Response) => {
    const q = parseListQuery(req, config.sortFields);

    const where: Record<string, unknown> = {};
    const search = buildSearchFilter(q.search, config.searchFields);
    const dateRange = buildDateRangeFilter(q.from, q.to);
    if (search) Object.assign(where, search);
    if (dateRange) Object.assign(where, dateRange);
    if (q.status) {
      if (!config.allowedStatuses.includes(q.status)) {
        throw AppError.badRequest(
          `Invalid status. Allowed: ${config.allowedStatuses.join(", ")}`
        );
      }
      where.status = q.status;
    }

    const [items, total] = await Promise.all([
      delegate().findMany({
        where,
        orderBy: { [q.sortBy]: q.sortDir },
        skip: q.skip,
        take: q.limit,
      }),
      delegate().count({ where }),
    ]);

    return sendSuccess(
      res,
      items,
      `${config.label} list`,
      200,
      buildPageMeta(total, q.page, q.limit)
    );
  });

  const getOne = asyncHandler(async (req: Request, res: Response) => {
    const record = await delegate().findUnique({ where: { id: req.params.id } });
    if (!record) throw AppError.notFound(`${config.label} not found`);
    return sendSuccess(res, record, `${config.label} detail`);
  });

  const updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body as { status: string };
    if (!config.allowedStatuses.includes(status)) {
      throw AppError.badRequest(
        `Invalid status. Allowed: ${config.allowedStatuses.join(", ")}`
      );
    }
    const existing = await delegate().findUnique({ where: { id: req.params.id } });
    if (!existing) throw AppError.notFound(`${config.label} not found`);

    const updated = await delegate().update({
      where: { id: req.params.id },
      data: { status },
    });
    return sendSuccess(res, updated, `${config.label} status updated`);
  });

  const remove = asyncHandler(async (req: Request, res: Response) => {
    const existing = await delegate().findUnique({ where: { id: req.params.id } });
    if (!existing) throw AppError.notFound(`${config.label} not found`);
    await delegate().delete({ where: { id: req.params.id } });
    return sendSuccess(res, { id: req.params.id }, `${config.label} deleted`);
  });

  return { list, getOne, updateStatus, remove };
}
