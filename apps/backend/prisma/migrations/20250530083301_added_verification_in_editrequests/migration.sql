-- AlterTable
ALTER TABLE "EditRequest" ADD COLUMN     "verificationId" INTEGER;

-- AddForeignKey
ALTER TABLE "EditRequest" ADD CONSTRAINT "EditRequest_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "Verification"("id") ON DELETE SET NULL ON UPDATE CASCADE;
