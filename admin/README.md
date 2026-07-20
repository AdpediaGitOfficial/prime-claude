# Prime Promenade — Admin Dashboard

Dedicated admin console for the Prime Promenade website, built with **Next.js
(App Router)** and talking to the backend admin API (`/api/admin/*`).

- Secure JWT login (access + refresh, auto-refresh on 401)
- Dashboard: stats, 30-day analytics chart, service breakdown, recent bookings
- Bookings: Pool / Conference / Spa — search, status filter, sort, status
  change, delete, pagination
- Enquiries: Vendor / Course / Gym / Contact — same controls
- Vendor Counters: live availability toggle (flips the public `/vendor` page)
- Content & Settings: edit contact details and social links
- Light / dark theme, Prime Promenade brand styling

## Quick start

```bash
cd admin
cp .env.example .env.local        # set NEXT_PUBLIC_API_BASE_URL to the backend
npm install
npm run dev                        # http://localhost:4000
```

The backend (see `../backend`) must be running and its `CORS_ORIGINS` must
include the admin origin (e.g. `http://localhost:4000`). Sign in with the
seeded admin credentials.

Production:

```bash
npm run build && npm start         # serves on :4000
```

## Structure

```
admin/src/
├── app/
│   ├── layout.tsx                 # AuthProvider + global styles
│   ├── login/page.tsx             # login screen
│   └── (dashboard)/               # protected route group (Shell)
│       ├── page.tsx               # dashboard
│       ├── bookings/  enquiries/  counters/  content/
├── components/  Shell · ResourceTable · Toast
└── lib/         api (JWT + refresh) · auth (context) · format
```

`ResourceTable` is a config-driven table reused by Bookings and Enquiries —
one component covers every collection with search, filter, sort, status
updates, delete and pagination.
