/*
  Warnings:

  - A unique constraint covering the columns `[applicationNumber,applicantType,department,reassignCount]` on the table `Loan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Loan_applicationNumber_applicantType_key";

-- AlterTable
ALTER TABLE "public"."Loan" ADD COLUMN     "reassignCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Loan_applicationNumber_applicantType_department_reassignCou_key" ON "public"."Loan"("applicationNumber", "applicantType", "department", "reassignCount");
