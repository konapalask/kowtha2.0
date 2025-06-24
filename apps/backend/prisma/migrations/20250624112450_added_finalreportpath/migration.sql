/*
  Warnings:

  - You are about to drop the `VerificationReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VerificationReport" DROP CONSTRAINT "VerificationReport_loanId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationReport" DROP CONSTRAINT "VerificationReport_verifierId_fkey";

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "finalReportPath" TEXT;

-- DropTable
DROP TABLE "VerificationReport";
