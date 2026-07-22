-- Human-readable reference (enrollment ID) for course registrations.
CREATE SEQUENCE "course_registration_ref_seq";

-- Existing rows are backfilled sequentially (volatile default).
ALTER TABLE "course_registrations" ADD COLUMN "reference" TEXT NOT NULL DEFAULT ('ENR-' || lpad(nextval('course_registration_ref_seq'::regclass)::text, 5, '0'));

CREATE UNIQUE INDEX "course_registrations_reference_key" ON "course_registrations"("reference");
