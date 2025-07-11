-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('Local', 'Remote');

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "locationType" "LocationType";
