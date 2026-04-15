-- CreateIndex
CREATE INDEX "Loan_department_createdAt_idx" ON "Loan"("department", "createdAt");

-- CreateIndex
CREATE INDEX "Loan_department_status_idx" ON "Loan"("department", "status");

-- CreateIndex
CREATE INDEX "Loan_department_bankName_idx" ON "Loan"("department", "bankName");
