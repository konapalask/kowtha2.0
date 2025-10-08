-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'VerificationExecutive';

-- AlterTable
ALTER TABLE "public"."Loan" ADD COLUMN     "templateName" TEXT;

-- AlterTable
ALTER TABLE "public"."Verification" ADD COLUMN     "templateName" TEXT;
