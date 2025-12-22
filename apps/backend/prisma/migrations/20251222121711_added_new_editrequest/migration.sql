-- AlterEnum
ALTER TYPE "public"."EditRequestType" ADD VALUE 'FinancialAnalysis';

-- AlterTable
ALTER TABLE "public"."Attendance" ALTER COLUMN "date" DROP NOT NULL;
