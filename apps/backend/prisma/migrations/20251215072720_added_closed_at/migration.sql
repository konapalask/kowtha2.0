-- AlterTable
ALTER TABLE "public"."Loan" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "closedById" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Loan" ADD CONSTRAINT "Loan_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
