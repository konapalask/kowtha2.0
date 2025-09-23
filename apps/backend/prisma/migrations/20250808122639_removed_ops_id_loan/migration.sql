-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_operationsExecutiveId_fkey";

-- AlterTable
ALTER TABLE "Loan" ALTER COLUMN "operationsExecutiveId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_operationsExecutiveId_fkey" FOREIGN KEY ("operationsExecutiveId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
