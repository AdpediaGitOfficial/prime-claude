-- Physical pool assignment: 1 = small pool (≤8), 2 = group pool (≤12).
ALTER TABLE "pool_bookings" ADD COLUMN "poolId" INTEGER;

-- Backfill existing bookings, respecting roles and avoiding per-pool overlaps.
-- Group bookings → pool 2; others prefer pool 1, overflow to pool 2.
DO $$
DECLARE
  r RECORD;
  v_start TIME; v_end TIME;
  p1_busy BOOLEAN; p2_busy BOOLEAN;
  is_group BOOLEAN;
BEGIN
  FOR r IN
    SELECT id, date, "timeSlot", "poolType"
    FROM "pool_bookings"
    WHERE "poolId" IS NULL AND status <> 'CANCELLED'
    ORDER BY date, "timeSlot"
  LOOP
    BEGIN
      v_start := to_timestamp(btrim(split_part(r."timeSlot", '-', 1)), 'HH12:MI AM')::time;
      v_end   := to_timestamp(btrim(split_part(r."timeSlot", '-', 2)), 'HH12:MI AM')::time;
    EXCEPTION WHEN OTHERS THEN
      CONTINUE; -- unparseable slot → leave poolId NULL
    END;

    is_group := r."poolType" ILIKE '%group%';

    SELECT EXISTS (
      SELECT 1 FROM "pool_bookings" b
      WHERE b.date = r.date AND b."poolId" = 1 AND b.status <> 'CANCELLED'
        AND to_timestamp(btrim(split_part(b."timeSlot", '-', 1)), 'HH12:MI AM')::time < v_end
        AND to_timestamp(btrim(split_part(b."timeSlot", '-', 2)), 'HH12:MI AM')::time > v_start
    ) INTO p1_busy;
    SELECT EXISTS (
      SELECT 1 FROM "pool_bookings" b
      WHERE b.date = r.date AND b."poolId" = 2 AND b.status <> 'CANCELLED'
        AND to_timestamp(btrim(split_part(b."timeSlot", '-', 1)), 'HH12:MI AM')::time < v_end
        AND to_timestamp(btrim(split_part(b."timeSlot", '-', 2)), 'HH12:MI AM')::time > v_start
    ) INTO p2_busy;

    IF is_group THEN
      UPDATE "pool_bookings" SET "poolId" = 2 WHERE id = r.id;
    ELSIF NOT p1_busy THEN
      UPDATE "pool_bookings" SET "poolId" = 1 WHERE id = r.id;
    ELSIF NOT p2_busy THEN
      UPDATE "pool_bookings" SET "poolId" = 2 WHERE id = r.id;
    ELSE
      UPDATE "pool_bookings" SET "poolId" = 1 WHERE id = r.id; -- historical overbook → default 1
    END IF;
  END LOOP;
END $$;

CREATE INDEX "pool_bookings_poolId_date_idx" ON "pool_bookings"("poolId", "date");
