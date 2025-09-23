-- CreateTable
CREATE TABLE "PDEmailLog" (
    "id" SERIAL NOT NULL,
    "messageID" TEXT NOT NULL,
    "fromEmail" TEXT[],
    "toEmail" TEXT[],
    "ccEmail" TEXT[],
    "bccEmail" TEXT[],
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "attachments" TEXT[],
    "receivedAt" TIMESTAMP(3),
    "parsedData" JSONB,
    "s3Path" TEXT,
    "loanId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PDEmailLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PDEmailLog" ADD CONSTRAINT "PDEmailLog_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
