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

const POOL_FEATURES_BASE = [
  "Ozone, temperature-controlled pool",
  "Private cabana",
  "Premium towel service",
];

// Pool packages — mirror the frontend PLANS array (pool-booking page) EXACTLY.
const POOL_PLANS = [
  {
    name: "Solo", code: "POOL-SOLO", price: 500, durationLabel: "60 min", capacity: 1,
    metadata: { caption: "Just you", badge: "1 person", features: POOL_FEATURES_BASE },
  },
  {
    name: "Duo", code: "POOL-DUO", price: 1000, durationLabel: "60 min", capacity: 2,
    metadata: { caption: "For two", badge: "2 people", features: POOL_FEATURES_BASE },
  },
  {
    name: "Session", code: "POOL-SESSION", price: 1500, durationLabel: "90 min", capacity: 8,
    metadata: {
      caption: "Small groups & families", badge: "Up to 8 people", popular: true,
      features: [
        "Ozone, temperature-controlled pool",
        "Private cabanas & towel service",
        "Dedicated speaker system",
        "Kids above 5 years welcome",
      ],
    },
  },
  {
    name: "Group Function", code: "POOL-GROUP", price: 3000, durationLabel: "180 min", capacity: 12,
    metadata: {
      caption: "Parties & celebrations", badge: "Up to 12",
      features: [
        "Entire pool reserved for your group",
        "Private cabanas & towel service",
        "Dedicated speaker system",
        "Food from Promenade Café on request",
      ],
    },
  },
];

// Spa services shown on the /spa page (exact names).
const SPA_SERVICES = [
  "Spa Massage",
  "Salon and Hairstyling",
  "Facial and Skin Care",
  "Nail Spa",
  "Hair Treatment",
  "Aromatherapy",
  "Cleanup Services",
  "Manicure and Pedicure",
];

// Courses shown on the /study-centre page (exact content).
const COURSES = [
  {
    name: "Tekla Structures – Basic to Advanced", code: "COURSE-TEKLA",
    durationLabel: "Starting from 100-120 hours",
    metadata: {
      modules: ["Intro to Tekla", "3D Modeling (Steel, PEB, Concrete)", "Components", "Drawings & BOM"],
      eligibility: [
        "Civil/Mechanical Engineering students (Diploma/B.Tech)",
        "Structural Engineers",
        "Draughtsmen & Designers",
        "Working Professionals",
      ],
    },
  },
  {
    name: "Structural Steel Design - Basic to Advanced", code: "COURSE-STEEL",
    durationLabel: "Starting from 100-120 hours",
    metadata: {
      modules: [
        "Introduction to Structural Engineering",
        "Structural Analysis and Design based on IS and AISC codes",
        "RCC substructure and Steel Design Principles",
        "Software Basics (Matrix/STAAD)",
      ],
      eligibility: [
        "Civil Engineering students (B.Tech/M.Tech)",
        "Architectural Students",
        "Designers",
        "Working Professionals",
      ],
    },
  },
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

  // Managed package catalog — kept in sync with the front-end content. The
  // upsert refreshes the core fields so re-seeding restores the canonical
  // catalog (name/price/duration/features).
  for (const [i, p] of POOL_PLANS.entries()) {
    const data = {
      name: p.name, price: p.price, durationLabel: p.durationLabel,
      capacity: p.capacity, order: i, metadata: p.metadata,
    };
    await prisma.listing.upsert({
      where: { type_code: { type: ListingType.POOL, code: p.code } },
      update: data,
      create: { type: ListingType.POOL, code: p.code, ...data },
    });
  }
  for (const [i, name] of SPA_SERVICES.entries()) {
    const code = `SPA-${i + 1}`;
    await prisma.listing.upsert({
      where: { type_code: { type: ListingType.SPA_SERVICE, code } },
      update: { name, order: i },
      create: { type: ListingType.SPA_SERVICE, name, code, order: i },
    });
  }
  for (const [i, c] of COURSES.entries()) {
    const data = { name: c.name, durationLabel: c.durationLabel, metadata: c.metadata, order: i };
    await prisma.listing.upsert({
      where: { type_code: { type: ListingType.COURSE, code: c.code } },
      update: data,
      create: { type: ListingType.COURSE, code: c.code, ...data },
    });
  }
  console.log("✓ Pool / spa / course listings");
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
