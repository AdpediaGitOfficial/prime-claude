-- Sequences that power the human-readable booking references (order IDs).
CREATE SEQUENCE "pool_booking_ref_seq";
CREATE SEQUENCE "hall_booking_ref_seq";
CREATE SEQUENCE "spa_booking_ref_seq";

-- AlterTable: add a unique, human-readable reference to every booking.
-- Existing rows are backfilled sequentially because the default is volatile.
ALTER TABLE "pool_bookings" ADD COLUMN "reference" TEXT NOT NULL DEFAULT ('POOL-' || lpad(nextval('pool_booking_ref_seq'::regclass)::text, 5, '0'));
ALTER TABLE "hall_bookings" ADD COLUMN "reference" TEXT NOT NULL DEFAULT ('HALL-' || lpad(nextval('hall_booking_ref_seq'::regclass)::text, 5, '0'));
ALTER TABLE "spa_bookings"  ADD COLUMN "reference" TEXT NOT NULL DEFAULT ('SPA-'  || lpad(nextval('spa_booking_ref_seq'::regclass)::text, 5, '0'));

-- CreateIndex
CREATE UNIQUE INDEX "pool_bookings_reference_key" ON "pool_bookings"("reference");
CREATE UNIQUE INDEX "hall_bookings_reference_key" ON "hall_bookings"("reference");
CREATE UNIQUE INDEX "spa_bookings_reference_key" ON "spa_bookings"("reference");
