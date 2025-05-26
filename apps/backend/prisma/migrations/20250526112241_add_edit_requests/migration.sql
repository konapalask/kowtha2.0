-- CreateEnum
CREATE TYPE "EditRequestStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateTable
CREATE TABLE "EditRequest" (
    "id" SERIAL NOT NULL,
    "loanId" INTEGER NOT NULL,
    "requestedBy" INTEGER NOT NULL,
    "approvedBy" INTEGER,
    "status" "EditRequestStatus" NOT NULL,
    "changes" JSONB NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EditRequest" ADD CONSTRAINT "EditRequest_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditRequest" ADD CONSTRAINT "EditRequest_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditRequest" ADD CONSTRAINT "EditRequest_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
