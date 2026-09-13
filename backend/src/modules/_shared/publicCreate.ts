import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";

/**
 * Factory for a public "submit form → create record" endpoint. The validated
 * request body maps 1:1 onto the Prisma model, so one implementation serves
 * spa bookings, gym memberships, vendor invites, course registrations and
 * contact enquiries. Returns the created record (raw shape) with 201.
 */
export function createPublicCreateHandler(model: keyof typeof prisma) {
  const delegate = prisma[model] as unknown as {
    create: (args: { data: unknown }) => Promise<unknown>;
  };

  return asyncHandler(async (req: Request, res: Response) => {
    const record = await delegate.create({ data: req.body });
    return res.status(201).json(record);
  });
}
