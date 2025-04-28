/*
  Warnings:

  - You are about to drop the `LoanFieldExecutive` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('PermanentAddress', 'CurrentAddress', 'Work');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('Pending', 'InProgress', 'Completed');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LoanStatus" ADD VALUE 'FieldVerificationStarted';
ALTER TYPE "LoanStatus" ADD VALUE 'FieldVerificationComplete';

-- DropForeignKey
ALTER TABLE "LoanFieldExecutive" DROP CONSTRAINT "LoanFieldExecutive_fieldExecutiveId_fkey";

-- DropForeignKey
ALTER TABLE "LoanFieldExecutive" DROP CONSTRAINT "LoanFieldExecutive_loanId_fkey";

-- DropTable
DROP TABLE "LoanFieldExecutive";

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "loanId" INTEGER NOT NULL,
    "type" "VerificationType" NOT NULL,
    "fieldExecutiveId" INTEGER NOT NULL,
    "status" "VerificationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Verification_loanId_type_key" ON "Verification"("loanId", "type");

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_fieldExecutiveId_fkey" FOREIGN KEY ("fieldExecutiveId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
