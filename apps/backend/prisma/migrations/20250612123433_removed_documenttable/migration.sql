/*
  Warnings:

  - You are about to drop the column `paths` on the `Verification` table. All the data in the column will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_loanId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_uploadedById_fkey";

-- AlterTable
ALTER TABLE "Loan" ALTER COLUMN "loanAmount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "paths",
ADD COLUMN     "path" TEXT;

-- DropTable
DROP TABLE "Document";
