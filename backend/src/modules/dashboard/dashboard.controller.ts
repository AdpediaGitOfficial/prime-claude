import type { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n: number): Date {
  const d = startOfToday();
  d.setDate(d.getDate() - n);
  return d;
}

/**
 * GET /api/admin/dashboard/stats
 * High-level counts for the dashboard cards.
 */
export const stats = asyncHandler(async (_req: Request, res: Response) => {
  const today = startOfToday();
  const weekAgo = daysAgo(7);

  const [
    poolTotal,
    hallTotal,
    spaTotal,
    gymTotal,
    vendorTotal,
    courseTotal,
    contactTotal,
    poolToday,
    hallToday,
    spaToday,
    pendingHall,
    pendingSpa,
    newLeads,
    poolRevenue,
    counterTotal,
    counterAvailable,
    weeklyPool,
  ] = await Promise.all([
    prisma.poolBooking.count(),
    prisma.hallBooking.count(),
    prisma.spaBooking.count(),
    prisma.gymMembership.count(),
    prisma.vendorInvite.count(),
    prisma.courseRegistration.count(),
    prisma.contactEnquiry.count(),
    prisma.poolBooking.count({ where: { createdAt: { gte: today } } }),
    prisma.hallBooking.count({ where: { createdAt: { gte: today } } }),
    prisma.spaBooking.count({ where: { createdAt: { gte: today } } }),
    prisma.hallBooking.count({ where: { status: "PENDING" } }),
    prisma.spaBooking.count({ where: { status: "PENDING" } }),
    prisma.contactEnquiry.count({ where: { status: "NEW" } }),
    prisma.poolBooking.aggregate({ _sum: { totalAmount: true } }),
    prisma.listing.count({ where: { type: "VENDOR_COUNTER" } }),
    prisma.listing.count({ where: { type: "VENDOR_COUNTER", isAvailable: true } }),
    prisma.poolBooking.count({ where: { createdAt: { gte: weekAgo } } }),
  ]);

  const totalBookings = poolTotal + hallTotal + spaTotal;
  const totalEnquiries = gymTotal + vendorTotal + courseTotal + contactTotal;

  return sendSuccess(
    res,
    {
      totals: {
        bookings: totalBookings,
        enquiries: totalEnquiries,
        poolBookings: poolTotal,
        hallBookings: hallTotal,
        spaBookings: spaTotal,
        gymMemberships: gymTotal,
        vendorInvites: vendorTotal,
        courseRegistrations: courseTotal,
        contactEnquiries: contactTotal,
      },
      today: {
        poolBookings: poolToday,
        hallBookings: hallToday,
        spaBookings: spaToday,
      },
      weekly: { poolBookings: weeklyPool },
      pending: {
        hallBookings: pendingHall,
        spaBookings: pendingSpa,
        newContactEnquiries: newLeads,
      },
      revenue: { poolTotal: poolRevenue._sum.totalAmount ?? 0 },
      vendorCounters: {
        total: counterTotal,
        available: counterAvailable,
        booked: counterTotal - counterAvailable,
      },
    },
    "Dashboard stats"
  );
});

/**
 * GET /api/admin/dashboard/analytics?range=30
 * Daily buckets of new bookings/enquiries over the requested window.
 */
export const analytics = asyncHandler(async (req: Request, res: Response) => {
  const range = Math.min(365, Math.max(7, Number.parseInt(String(req.query.range ?? "30"), 10) || 30));
  const since = daysAgo(range - 1);

  const [pool, hall, spa, gym, vendor, course, contact] = await Promise.all([
    prisma.poolBooking.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.hallBooking.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.spaBooking.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.gymMembership.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.vendorInvite.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.courseRegistration.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.contactEnquiry.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
  ]);

  // Build an ordered set of day keys and zero-fill.
  const buckets = new Map<string, Record<string, number>>();
  for (let i = 0; i < range; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { pool: 0, hall: 0, spa: 0, gym: 0, vendor: 0, course: 0, contact: 0 });
  }

  const bump = (rows: { createdAt: Date }[], field: string) => {
    for (const row of rows) {
      const key = row.createdAt.toISOString().slice(0, 10);
      const bucket = buckets.get(key);
      if (bucket) bucket[field] += 1;
    }
  };
  bump(pool, "pool");
  bump(hall, "hall");
  bump(spa, "spa");
  bump(gym, "gym");
  bump(vendor, "vendor");
  bump(course, "course");
  bump(contact, "contact");

  const series = Array.from(buckets.entries()).map(([date, counts]) => ({ date, ...counts }));

  return sendSuccess(res, { range, series }, "Dashboard analytics");
});
