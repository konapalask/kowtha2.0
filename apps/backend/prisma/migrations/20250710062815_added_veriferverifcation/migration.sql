/*
  Warnings:

  - You are about to drop the column `verifierId` on the `Loan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_verifierId_fkey";

-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "verifierId";

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "verifierId" INTEGER;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_verifierId_fkey" FOREIGN KEY ("verifierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
