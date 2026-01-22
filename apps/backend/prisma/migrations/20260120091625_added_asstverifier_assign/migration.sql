-- AlterTable
ALTER TABLE "public"."Verification" ADD COLUMN     "assistantVerifierId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Verification" ADD CONSTRAINT "Verification_assistantVerifierId_fkey" FOREIGN KEY ("assistantVerifierId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
