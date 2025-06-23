-- CreateEnum
CREATE TYPE "ApprovedStatus" AS ENUM ('Positive', 'Negative');

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "approvedStatus" "ApprovedStatus";
