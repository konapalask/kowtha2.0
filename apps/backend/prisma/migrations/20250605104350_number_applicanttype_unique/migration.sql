/*
  Warnings:

  - A unique constraint covering the columns `[applicationNumber,applicantType]` on the table `Loan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Loan_applicationNumber_applicantType_key" ON "Loan"("applicationNumber", "applicantType");
