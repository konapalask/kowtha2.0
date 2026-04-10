-- CreateEnum
CREATE TYPE "LoanTag" AS ENUM ('PD', 'LIP');

-- AlterTable
ALTER TABLE "Loan" ADD COLUMN "loanTag" "LoanTag",
ADD COLUMN "branch" VARCHAR(30);
