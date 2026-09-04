-- Login tracking + fuller audit indexing.
-- Additive & idempotent (safe to re-run via `prisma migrate deploy`).

-- Per-attempt admin login history (success or failure).
CREATE TABLE IF NOT EXISTS "login_events" (
  "id"        TEXT NOT NULL,
  "adminId"   TEXT,
  "email"     TEXT NOT NULL,
  "success"   BOOLEAN NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "login_events_pkey" PRIMARY KEY ("id")
);

-- FK to admin_users; NULL on delete so history survives account removal.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'login_events_adminId_fkey'
  ) THEN
    ALTER TABLE "login_events"
      ADD CONSTRAINT "login_events_adminId_fkey"
      FOREIGN KEY ("adminId") REFERENCES "admin_users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "login_events_adminId_idx"   ON "login_events"("adminId");
CREATE INDEX IF NOT EXISTS "login_events_createdAt_idx" ON "login_events"("createdAt");

-- New indexes for the audit-log view (filter by admin, sort by time).
CREATE INDEX IF NOT EXISTS "audit_logs_adminId_idx"   ON "audit_logs"("adminId");
CREATE INDEX IF NOT EXISTS "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");
