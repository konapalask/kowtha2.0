-- DropForeignKey
ALTER TABLE "EditRequest" DROP CONSTRAINT "EditRequest_loanId_fkey";

-- AlterTable
ALTER TABLE "EditRequest" ALTER COLUMN "loanId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EditRequest" ADD CONSTRAINT "EditRequest_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
