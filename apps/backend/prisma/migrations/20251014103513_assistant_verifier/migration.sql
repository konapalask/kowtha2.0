-- AlterEnum
ALTER TYPE "public"."ApprovedStatus" ADD VALUE 'CreditRefer';

-- AlterTable
ALTER TABLE "public"."Verification" ADD COLUMN     "initialSubmitted" BOOLEAN DEFAULT false;
