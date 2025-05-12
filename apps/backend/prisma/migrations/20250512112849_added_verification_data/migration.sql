-- CreateEnum
CREATE TYPE "PictureSource" AS ENUM ('Camera', 'Gallery');

-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "isAddressSame" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "pictureSource" "PictureSource",
ADD COLUMN     "verificationData" JSONB;
