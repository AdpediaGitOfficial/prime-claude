#!/usr/bin/env bash
#
# Prime Promenade — one-shot build & deploy for all three tiers.
# Centralises the build-time URLs so the public site / admin can never
# silently fall back to http://localhost:5000.
#
# Usage (from the repo root):
#   ./deploy/deploy.sh              # pull latest + redeploy all three tiers
#   ./deploy/deploy.sh --seed       # FIRST deploy only (seeds the DB)
#   ./deploy/deploy.sh --no-pull    # skip git pull (build the current checkout)
#
# Override the target per-environment via env vars, e.g. the real domain:
#   API_BASE_URL=https://api.primepromenade.com ADMIN_BASE_PATH= \
#     SITE_WEB_ROOT=/var/www/primepromenade ./deploy/deploy.sh
#
set -euo pipefail

# ── Config (defaults = testing on prime.adpedia.in) ──────────
API_BASE_URL="${API_BASE_URL:-https://prime.adpedia.in/backend}"
ADMIN_BASE_PATH="${ADMIN_BASE_PATH:-/admin}"     # "" for subdomain admin
SITE_WEB_ROOT="${SITE_WEB_ROOT:-/var/www/prime}"
SUDO="${SUDO-sudo}"                               # SUDO= to disable
# ─────────────────────────────────────────────────────────────

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SEED=0
PULL=1
for arg in "$@"; do
  [ "$arg" = "--seed" ] && SEED=1
  [ "$arg" = "--no-pull" ] && PULL=0
done

echo "▶ Deploying Prime Promenade"
echo "    API base URL      : $API_BASE_URL"
echo "    Admin base path   : ${ADMIN_BASE_PATH:-<none / subdomain>}"
echo "    Site web root      : $SITE_WEB_ROOT"
echo "    Pull latest code   : $([ $PULL = 1 ] && echo yes || echo no)"
echo "    Seed database      : $([ $SEED = 1 ] && echo yes || echo no)"
echo

# 0. Refresh code (fast-forward the checked-out branch) --------
if [ "$PULL" = "1" ]; then
  echo "── Git ──────────────────────────────────"
  BRANCH="$(git -C "$ROOT" rev-parse --abbrev-ref HEAD)"
  echo "  fetching + fast-forwarding origin/$BRANCH …"
  git -C "$ROOT" fetch origin "$BRANCH"
  git -C "$ROOT" pull --ff-only origin "$BRANCH"
  echo "  now at: $(git -C "$ROOT" rev-parse --short HEAD)"
fi

# 1. Backend ---------------------------------------------------
echo "── Backend ──────────────────────────────"
cd "$ROOT/backend"
npm ci
rm -rf dist
npm run build
npx prisma generate
npx prisma migrate deploy
if [ "$SEED" = "1" ]; then
  echo "  seeding baseline data (first deploy)…"
  npm run seed
fi

# 2. Admin dashboard -------------------------------------------
echo "── Admin dashboard ──────────────────────"
cd "$ROOT/admin"
npm ci
rm -rf .next                                   # wipe stale chunks (avoids ChunkLoadError)
NEXT_PUBLIC_API_BASE_URL="$API_BASE_URL" \
NEXT_PUBLIC_BASE_PATH="$ADMIN_BASE_PATH" \
  npm run build

# 3. Public site (static export) -------------------------------
echo "── Public site ──────────────────────────"
cd "$ROOT/prime-source-code"
npm ci
rm -rf .next out                               # fresh static export, no stale chunks
NEXT_PUBLIC_API_BASE_URL="$API_BASE_URL" npm run build
echo "  syncing out/ → $SITE_WEB_ROOT"
$SUDO mkdir -p "$SITE_WEB_ROOT"
$SUDO rsync -a --delete out/ "$SITE_WEB_ROOT/"

# 4. Restart the Node apps -------------------------------------
echo "── pm2 ──────────────────────────────────"
cd "$ROOT"
if pm2 describe pp-api >/dev/null 2>&1; then
  pm2 restart pp-api pp-admin --update-env
else
  pm2 start deploy/ecosystem.config.js
  pm2 save
fi

echo
echo "✓ Deployed."
echo "  Verify:  curl -s $API_BASE_URL/health"
echo "  Site:    ${API_BASE_URL%/backend}/"
echo "  Admin:   ${API_BASE_URL%/backend}${ADMIN_BASE_PATH}"
