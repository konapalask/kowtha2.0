-- Replace LoanStatus enum: drop Approved + Rejected (no rows in those states),
-- add Completed (set by closeLoan when a Verifier/Admin marks a PD loan closed).
--
-- Atomic rename -> recreate -> cast -> drop. Safe because no Loan row is in
-- 'Approved' or 'Rejected' on prod or dev (verified 2026-05-04 / 2026-05-05).

ALTER TYPE "LoanStatus" RENAME TO "LoanStatus_old";

CREATE TYPE "LoanStatus" AS ENUM (
  'Unassigned',
  'Assigned',
  'UnderFV',
  'FVCompleted',
  'BackendCompleted',
  'Completed'
);

ALTER TABLE "Loan"
  ALTER COLUMN status TYPE "LoanStatus"
  USING (status::text::"LoanStatus");

DROP TYPE "LoanStatus_old";
