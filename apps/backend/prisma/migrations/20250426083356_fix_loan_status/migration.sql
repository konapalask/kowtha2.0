/*
  Warnings:

  - The values [Pending,InProgress,Verified,FieldVerificationStarted,FieldVerificationComplete] on the enum `LoanStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LoanStatus_new" AS ENUM ('Unassigned', 'Assigned', 'UnderFV', 'FVCompleted', 'Approved', 'Rejected');
ALTER TABLE "Loan" ALTER COLUMN "status" TYPE "LoanStatus_new" USING ("status"::text::"LoanStatus_new");
ALTER TYPE "LoanStatus" RENAME TO "LoanStatus_old";
ALTER TYPE "LoanStatus_new" RENAME TO "LoanStatus";
DROP TYPE "LoanStatus_old";
COMMIT;
