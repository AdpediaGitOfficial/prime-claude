import type { Request, Response } from "express";
import { Prisma, type ListingType } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import { sendSuccess } from "../../utils/apiResponse";

/**
 * GET /listings?type=VENDOR_COUNTER
 * Public — returns active listings. Powers live availability on the frontend
 * (e.g. the /vendor counters grid can mark booked counters from this).
 */
export const listPublicListings = asyncHandler(async (req: Request, res: Response) => {
  const type = req.query.type as ListingType | undefined;
  const listings = await prisma.listing.findMany({
    where: { isActive: true, ...(type ? { type } : {}) },
    orderBy: [{ type: "asc" }, { order: "asc" }],
    select: {
      id: true,
      type: true,
      name: true,
      code: true,
      description: true,
      price: true,
      durationLabel: true,
      capacity: true,
      isAvailable: true,
      order: true,
      metadata: true,
    },
  });
  return res.status(200).json(listings);
});

// ─── Admin CRUD ──────────────────────────────────────────────

export const adminListListings = asyncHandler(async (req: Request, res: Response) => {
  const type = req.query.type as ListingType | undefined;
  const listings = await prisma.listing.findMany({
    where: { ...(type ? { type } : {}) },
    orderBy: [{ type: "asc" }, { order: "asc" }],
  });
  return sendSuccess(res, listings, "Listings");
});

export const adminGetListing = asyncHandler(async (req: Request, res: Response) => {
  const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!listing) throw AppError.notFound("Listing not found");
  return sendSuccess(res, listing, "Listing detail");
});

export const adminCreateListing = asyncHandler(async (req: Request, res: Response) => {
  const listing = await prisma.listing.create({
    data: req.body as Prisma.ListingCreateInput,
  });
  return sendSuccess(res, listing, "Listing created", 201);
});

export const adminUpdateListing = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!existing) throw AppError.notFound("Listing not found");
  const listing = await prisma.listing.update({
    where: { id: req.params.id },
    data: req.body as Prisma.ListingUpdateInput,
  });
  return sendSuccess(res, listing, "Listing updated");
});

export const adminSetAvailability = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!existing) throw AppError.notFound("Listing not found");
  const listing = await prisma.listing.update({
    where: { id: req.params.id },
    data: { isAvailable: (req.body as { isAvailable: boolean }).isAvailable },
  });
  return sendSuccess(res, listing, "Availability updated");
});

export const adminDeleteListing = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!existing) throw AppError.notFound("Listing not found");
  await prisma.listing.delete({ where: { id: req.params.id } });
  return sendSuccess(res, { id: req.params.id }, "Listing deleted");
});
