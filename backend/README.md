# Prime Promenade — Backend & Admin API

Production backend and admin API for the Prime Promenade website.

- **Runtime:** Node.js + Express (TypeScript)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT (access + rotating refresh) with role-based access
- **Validation:** Zod
- **Docs:** Swagger UI at `/api/docs`
- **File storage:** local disk (`/uploads`)

The public endpoints mirror the existing frontend contract **exactly**, so no
frontend change is required for the site to talk to this API.

---

## 1. Quick start

```bash
cd backend
cp .env.example .env          # then edit values (DATABASE_URL, secrets…)
npm install
npm run prisma:generate
npm run prisma:migrate         # creates tables (dev)
npm run seed                   # admin user + 30 counters + listings + settings
npm run dev                    # http://localhost:5000  (docs: /api/docs)
```

Production:

```bash
npm run build
npm run prisma:deploy          # apply migrations without prompts
npm start
```

Point the frontend at the API with `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000`.

---

## 2. Environment

See `.env.example` for the full list. Key variables:

| Var | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Token signing secrets |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |
| `OTP_PROVIDER` | `console` (dev) · `msg91` · `twilio` |
| `OTP_DEV_RETURN` | If `true` (non-prod), `send-otp` returns the code for testing |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Credentials created by the seed |
| `UPLOAD_DIR` / `PUBLIC_BASE_URL` | Local file storage + public URL base |

### OTP delivery
OTP is generated, hashed, stored and verified for real. Delivery is pluggable
via `OTP_PROVIDER`: `console` logs the code (dev); `msg91` / `twilio` call the
provider (drop credentials in `.env` and complete the marked call in
`src/utils/otp.ts`).

---

## 3. Architecture

```
backend/
├── prisma/
│   ├── schema.prisma        # all models + enums
│   ├── migrations/
│   └── seed.ts              # admin, vendor counters, listings, settings
├── src/
│   ├── config/              # env · prisma client · swagger
│   ├── middleware/          # auth · roleGuard · validate · errorHandler · rateLimit
│   ├── utils/               # AppError · asyncHandler · apiResponse · queryParser · jwt · otp · hash
│   ├── modules/             # one folder per feature (routes · controller · service · schema)
│   │   ├── _shared/         # reusable resource/CRUD controllers + registry
│   │   ├── otp/  pool-bookings/  hall-bookings/  public-forms/
│   │   ├── admin-auth/  admin-users/  dashboard/  content/  listings/  uploads/
│   ├── routes/              # public.routes · admin.routes · index
│   ├── app.ts  server.ts
└── uploads/                 # served at /uploads
```

**Reusable components.** All seven booking/enquiry collections share one
`createResourceController` (list/get/status/delete with pagination, search,
date-range filter and sorting) driven by a config registry
(`modules/_shared/resources.ts`). Content collections (pages/banners/gallery)
share `createCrudController`. Adding a new managed collection is a few lines of
config, not a new controller.

Every response from **admin** routes uses `{ success, message, data, meta? }`.
**Public** routes keep their original raw shapes to preserve the frontend
contract.

---

## 4. API reference

Interactive docs: **`/api/docs`** (JSON at `/api/docs.json`).

### Public (existing frontend contract — unchanged)

| Method | Path | Used by |
|---|---|---|
| POST | `/api/auth/send-otp` | Pool booking |
| POST | `/api/bookings/create-verified` | Pool booking (OTP verified) |
| GET · POST | `/hall-bookings` | Conference (GET = booked dates) |
| POST | `/spa-bookings` | Spa |
| POST | `/gym-memberships` | Gym |
| POST | `/vendor-invites` | Vendor (invite + counter enquiry) |
| POST | `/course-registrations` | Study centre |
| POST | `/contact-enquiries` | Contact form *(new)* |
| GET | `/listings?type=VENDOR_COUNTER` | Live availability *(new)* |

### Admin (JWT — `Authorization: Bearer <token>`, prefix `/api/admin`)

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/login` · `/auth/refresh` · `/auth/logout` · `GET /auth/me` |
| Dashboard | `GET /dashboard/stats` · `GET /dashboard/analytics?range=30` |
| Bookings & enquiries | For each of `pool-bookings`, `hall-bookings`, `spa-bookings`, `gym-memberships`, `vendor-invites`, `course-registrations`, `contact-enquiries`: `GET /` (list) · `GET /:id` · `PATCH /:id/status` · `DELETE /:id` |
| Content | CRUD `/pages` · `/banners` · `/gallery`; `GET/PUT/DELETE /settings/:key` |
| Listings | `GET /listings` · `POST` · `GET/PUT /:id` · `PATCH /:id/availability` · `DELETE /:id` |
| Uploads | `POST /uploads` (multipart `file`) |
| Admin users | `GET/POST /admins` · `PUT/DELETE /admins/:id` (SUPER_ADMIN only) |

**List query params:** `?page=&limit=&search=&status=&from=&to=&sortBy=&sortDir=asc|desc`.

---

## 5. Roles

`SUPER_ADMIN` (full access, incl. admin-user management) · `ADMIN` (all
content & bookings) · `STAFF` (reserved for a read/limited role). The seed
creates one `SUPER_ADMIN`.

---

## 6. Scripts

| Script | Description |
|---|---|
| `npm run dev` | Dev server with reload |
| `npm run build` / `npm start` | Compile to `dist/` and run |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run prisma:migrate` | Create + apply a dev migration |
| `npm run prisma:deploy` | Apply migrations (production) |
| `npm run seed` | Seed baseline data |
| `npm run prisma:studio` | Prisma Studio (DB GUI) |
