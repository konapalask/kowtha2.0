-- CreateTable
CREATE TABLE "VerificationRetries" (
    "id" SERIAL NOT NULL,
    "verificationId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "geotag" TEXT,
    "address" TEXT,
    "reason" TEXT,
    "fieldExecutiveId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRetries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VerificationRetries" ADD CONSTRAINT "VerificationRetries_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "Verification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRetries" ADD CONSTRAINT "VerificationRetries_fieldExecutiveId_fkey" FOREIGN KEY ("fieldExecutiveId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
