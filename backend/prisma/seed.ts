import { PrismaClient, ListingType } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const SEED_ADMIN = {
  name: process.env.SEED_ADMIN_NAME ?? "Prime Admin",
  email: process.env.SEED_ADMIN_EMAIL ?? "admin@primepromenade.com",
  password: process.env.SEED_ADMIN_PASSWORD ?? "Admin@12345",
};

// Pool plans mirror the frontend PLANS array (pool-booking page).
const POOL_PLANS = [
  { name: "Solo Dip", code: "POOL-SOLO", price: 500, durationLabel: "90 min", capacity: 1 },
  { name: "Duo Splash", code: "POOL-DUO", price: 900, durationLabel: "90 min", capacity: 2 },
  { name: "Session Pass", code: "POOL-SESSION", price: 1500, durationLabel: "3 hours", capacity: 4 },
  { name: "Group Retreat", code: "POOL-GROUP", price: 2500, durationLabel: "3 hours", capacity: 8 },
];

// Spa services shown on the /spa page (kept generic; edit via admin later).
const SPA_SERVICES = [
  "Signature Glow Facial",
  "Aroma Relaxation Massage",
  "Hair Spa & Styling",
  "Body Polish & Scrub",
  "Bridal Package",
];

const GYM_PLANS = [
  { name: "Monthly", code: "GYM-1M", price: 1500, durationLabel: "1 Month" },
  { name: "Quarterly", code: "GYM-3M", price: 4000, durationLabel: "3 Months" },
  { name: "Annual", code: "GYM-12M", price: 12000, durationLabel: "1 Year" },
];

const COURSES = [
  "Tekla Structures – Basic to Advanced",
  "Structural Steel Design - Basic to Advanced",
];

const SITE_SETTINGS: Array<{ key: string; group: string; value: unknown }> = [
  {
    key: "contact",
    group: "contact",
    value: {
      generalEnquiry: "+91 90707 99 700",
      primePharma: "+91 90707 99 770",
      arenaBooking: "+91 90707 99 079",
      oxygymBooking: "+91 90707 99 709",
      email: "info@primepromenade.com",
      address: "Prime Promenade, Puzhakkal, Thrissur, Kerala",
    },
  },
  {
    key: "social",
    group: "social",
    value: {
      facebook: "https://www.facebook.com/61588610401388/",
      instagram: "https://www.instagram.com/prime_promenade",
    },
  },
];

async function seedAdmin() {
  const passwordHash = await bcrypt.hash(SEED_ADMIN.password, 10);
  await prisma.adminUser.upsert({
    where: { email: SEED_ADMIN.email },
    update: {},
    create: {
      name: SEED_ADMIN.name,
      email: SEED_ADMIN.email,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`✓ Admin: ${SEED_ADMIN.email}`);
}

async function seedListings() {
  // 30 vendor counters — these power live availability on the /vendor page.
  for (let i = 1; i <= 30; i++) {
    const code = `COUNTER-${String(i).padStart(2, "0")}`;
    await prisma.listing.upsert({
      where: { type_code: { type: ListingType.VENDOR_COUNTER, code } },
      update: {},
      create: {
        type: ListingType.VENDOR_COUNTER,
        name: `Counter ${String(i).padStart(2, "0")}`,
        code,
        isAvailable: true,
        order: i,
      },
    });
  }
  console.log("✓ 30 vendor counters");

  for (const [i, p] of POOL_PLANS.entries()) {
    await prisma.listing.upsert({
      where: { type_code: { type: ListingType.POOL, code: p.code } },
      update: {},
      create: { type: ListingType.POOL, order: i, ...p },
    });
  }
  for (const [i, p] of GYM_PLANS.entries()) {
    await prisma.listing.upsert({
      where: { type_code: { type: ListingType.GYM_PLAN, code: p.code } },
      update: {},
      create: { type: ListingType.GYM_PLAN, order: i, ...p },
    });
  }
  for (const [i, name] of SPA_SERVICES.entries()) {
    const code = `SPA-${i + 1}`;
    await prisma.listing.upsert({
      where: { type_code: { type: ListingType.SPA_SERVICE, code } },
      update: {},
      create: { type: ListingType.SPA_SERVICE, name, code, order: i },
    });
  }
  for (const [i, name] of COURSES.entries()) {
    const code = `COURSE-${i + 1}`;
    await prisma.listing.upsert({
      where: { type_code: { type: ListingType.COURSE, code } },
      update: {},
      create: { type: ListingType.COURSE, name, code, order: i },
    });
  }
  console.log("✓ Pool / gym / spa / course listings");
}

async function seedSettings() {
  for (const s of SITE_SETTINGS) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, group: s.group, value: s.value as object },
    });
  }
  console.log("✓ Site settings");
}

async function main() {
  console.log("Seeding Prime Promenade database…");
  await seedAdmin();
  await seedListings();
  await seedSettings();
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
