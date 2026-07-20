import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess, buildPageMeta } from "../../utils/apiResponse";
import { parseListQuery, buildSearchFilter } from "../../utils/queryParser";

type Delegate = {
  findMany: (args: unknown) => Promise<unknown[]>;
  count: (args: unknown) => Promise<number>;
  findUnique: (args: unknown) => Promise<unknown>;
  create: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
};

interface CrudConfig {
  model: keyof typeof prisma;
  label: string;
  searchFields: string[];
  sortFields: string[];
}

/** Full CRUD handlers for a content collection (pages / banners / gallery). */
export function createCrudController(config: CrudConfig) {
  const delegate = () => prisma[config.model] as unknown as Delegate;

  const list = asyncHandler(async (req: Request, res: Response) => {
    const q = parseListQuery(req, config.sortFields);
    const where = buildSearchFilter(q.search, config.searchFields) ?? {};
    const [items, total] = await Promise.all([
      delegate().findMany({ where, orderBy: { [q.sortBy]: q.sortDir }, skip: q.skip, take: q.limit }),
      delegate().count({ where }),
    ]);
    return sendSuccess(res, items, `${config.label} list`, 200, buildPageMeta(total, q.page, q.limit));
  });

  const getOne = asyncHandler(async (req: Request, res: Response) => {
    const record = await delegate().findUnique({ where: { id: req.params.id } });
    if (!record) throw AppError.notFound(`${config.label} not found`);
    return sendSuccess(res, record, `${config.label} detail`);
  });

  const create = asyncHandler(async (req: Request, res: Response) => {
    const record = await delegate().create({ data: req.body });
    return sendSuccess(res, record, `${config.label} created`, 201);
  });

  const update = asyncHandler(async (req: Request, res: Response) => {
    const existing = await delegate().findUnique({ where: { id: req.params.id } });
    if (!existing) throw AppError.notFound(`${config.label} not found`);
    const record = await delegate().update({ where: { id: req.params.id }, data: req.body });
    return sendSuccess(res, record, `${config.label} updated`);
  });

  const remove = asyncHandler(async (req: Request, res: Response) => {
    const existing = await delegate().findUnique({ where: { id: req.params.id } });
    if (!existing) throw AppError.notFound(`${config.label} not found`);
    await delegate().delete({ where: { id: req.params.id } });
    return sendSuccess(res, { id: req.params.id }, `${config.label} deleted`);
  });

  return { list, getOne, create, update, remove };
}
