# Prime Promenade — Deployment Runbook

Target setup (chosen): **single VPS + Nginx + pm2**, **managed PostgreSQL**,
**subdomains**, OTP in **console mode** (SMS provider to be wired later).

> ## ▶ TESTING NOW on https://prime.adpedia.in (single domain)
> For the test phase everything lives under one subdomain, path-based:
> `/` = site, `/admin` = admin, `/backend` = API — all same-origin (no CORS).
>
> **What differs from the subdomain runbook below:**
> | Step | Testing value |
> |---|---|
> | Backend env | use `deploy/backend.env.testing.example` (`CORS_ORIGINS=https://prime.adpedia.in`, `PUBLIC_BASE_URL=https://prime.adpedia.in/backend`) |
> | Backend web root (site) | copy `out/` to **`/var/www/prime`** |
> | Nginx | `deploy/nginx/prime.adpedia.in.conf` → `certbot --nginx -d prime.adpedia.in` |
> | Site build | `NEXT_PUBLIC_API_BASE_URL=https://prime.adpedia.in/backend npm run build` |
> | Admin build | `NEXT_PUBLIC_API_BASE_URL=https://prime.adpedia.in/backend NEXT_PUBLIC_BASE_PATH=/admin npm run build` |
>
> URLs: site `https://prime.adpedia.in` · admin `https://prime.adpedia.in/admin` ·
> API `https://prime.adpedia.in/backend` (health: `/backend/health`).
>
> **Moving to the real domain later:** rebuild both Next apps with the new
> `NEXT_PUBLIC_API_BASE_URL` (drop `NEXT_PUBLIC_BASE_PATH` if using subdomains),
> switch Nginx to `primepromenade.conf`, update `CORS_ORIGINS` + `PUBLIC_BASE_URL`,
> re-issue certs. **No database or code changes** — only build-time URLs + Nginx.

---

### Subdomain (production) runbook follows ↓

```
primepromenade.com          → static site   (Nginx serves prime-source-code/out)
admin.primepromenade.com    → admin app     (Nginx → Node :4000)
api.primepromenade.com      → backend API   (Nginx → Node :5000)  + /uploads volume
PostgreSQL                  → managed (Neon / Supabase / RDS / DO)
```

---

## 0. Provision (once)

- A VPS (Ubuntu 22.04+, ≥2 GB RAM): install **Node 20+**, **Nginx**, **pm2** (`npm i -g pm2`), **certbot** (`sudo apt install certbot python3-certbot-nginx`).
- A **managed PostgreSQL** database; copy its connection string.
- DNS **A-records** → the VPS IP for: `primepromenade.com`, `www`, `admin`, `api`.

## 1. Get the code
```bash
git clone <repo> /opt/prime && cd /opt/prime
git checkout claude/download-upload-git-f99jwi   # or main once merged
```

## 2. Backend
```bash
cd /opt/prime/backend
cp ../deploy/backend.env.example .env
#  → edit .env: DATABASE_URL, JWT secrets (openssl rand -hex 32),
#    CORS_ORIGINS, PUBLIC_BASE_URL, SEED_ADMIN_*
npm ci
npm run build
npx prisma migrate deploy          # create tables
npm run seed                       # FIRST DEPLOY ONLY (admin, catalog, settings)

# persistent uploads dir (survives redeploys)
mkdir -p /var/prime-uploads && ln -sfn /var/prime-uploads uploads
```

## 3. Admin dashboard
```bash
cd /opt/prime/admin
npm ci
NEXT_PUBLIC_API_BASE_URL=https://api.primepromenade.com npm run build
```

## 4. Public site (static)
```bash
cd /opt/prime/prime-source-code
npm ci
NEXT_PUBLIC_API_BASE_URL=https://api.primepromenade.com npm run build   # → out/
sudo mkdir -p /var/www/primepromenade
sudo rsync -a --delete out/ /var/www/primepromenade/
```

## 5. Start the Node apps (pm2)
```bash
cd /opt/prime
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup        # run the command it prints (systemd autostart)
pm2 status         # pp-api + pp-admin should be "online"
```

## 6. Nginx + TLS
```bash
sudo cp deploy/nginx/primepromenade.conf /etc/nginx/sites-available/primepromenade
sudo ln -s /etc/nginx/sites-available/primepromenade /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d primepromenade.com -d www.primepromenade.com \
                     -d admin.primepromenade.com -d api.primepromenade.com
```

## 7. Smoke test
```bash
curl https://api.primepromenade.com/health                 # {"success":true,...}
curl https://api.primepromenade.com/listings?type=POOL     # 4 pool packages
open https://primepromenade.com                            # site loads
open https://admin.primepromenade.com                      # admin login
```
Log into the admin, **change the seeded admin password**, edit a pool price,
reload the site → it should reflect. (Or run the A–E harness against the live URLs.)

---

## Redeploys (after code changes)

**One command — pulls the latest code, rebuilds all three tiers, runs
migrations, and restarts pm2:**
```bash
cd /opt/prime            # the repo checkout on the server
./deploy/deploy.sh       # git pull (current branch) → build → migrate → rsync → pm2 restart
```
The script auto-detects the checked-out branch and fast-forwards it, so
you don't need a separate `git pull`. It targets the **testing** setup
(`https://prime.adpedia.in`, admin under `/admin`, site → `/var/www/prime`)
by default. Flags / overrides:
```bash
./deploy/deploy.sh --no-pull        # build the current checkout, skip git pull
./deploy/deploy.sh --seed           # FIRST deploy only — re-seeds the DB
# real domain / subdomain layout:
API_BASE_URL=https://api.primepromenade.com ADMIN_BASE_PATH= \
  SITE_WEB_ROOT=/var/www/primepromenade ./deploy/deploy.sh
```

> Do **not** pass `--seed` on redeploys (it resets the catalog to defaults).
> The migrations (email-optional, pool no-OTP, booking references,
> enrollment references) apply automatically via `prisma migrate deploy`
> and backfill existing rows — no manual DB step.

<details><summary>Manual equivalent (if you're not using deploy.sh)</summary>

```bash
cd /opt/prime && git pull --ff-only
# backend
cd backend && npm ci && npm run build && npx prisma migrate deploy && pm2 restart pp-api
# admin
cd ../admin && npm ci && NEXT_PUBLIC_API_BASE_URL=https://prime.adpedia.in/backend \
  NEXT_PUBLIC_BASE_PATH=/admin npm run build && pm2 restart pp-admin
# site
cd ../prime-source-code && npm ci && NEXT_PUBLIC_API_BASE_URL=https://prime.adpedia.in/backend \
  npm run build && sudo rsync -a --delete out/ /var/www/prime/
```
</details>

## Operations
- **Logs:** `pm2 logs pp-api` / `pm2 logs pp-admin`; Nginx logs in `/var/log/nginx/`.
- **Backups:** managed Postgres handles DB backups; also back up `/var/prime-uploads`.
- **Secrets:** never commit `.env`; rotate JWT secrets if leaked (logs everyone out).
- **Uploads at scale:** for multiple app servers, move uploads to S3-compatible
  storage (single-VPS local disk is fine for now).

## To wire real OTP SMS later
Set `OTP_PROVIDER=msg91` (or `twilio`) + credentials in `backend/.env`, complete
the marked provider call in `backend/src/utils/otp.ts`, rebuild, `pm2 restart pp-api`.
Until then pool bookings can't verify by SMS; every other flow works.
