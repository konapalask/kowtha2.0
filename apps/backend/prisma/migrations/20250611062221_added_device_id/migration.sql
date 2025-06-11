-- CreateEnum
CREATE TYPE "EditRequestType" AS ENUM ('Login', 'LoanData', 'Other');

-- AlterTable
ALTER TABLE "EditRequest" ADD COLUMN     "type" "EditRequestType";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deviceId" TEXT;
