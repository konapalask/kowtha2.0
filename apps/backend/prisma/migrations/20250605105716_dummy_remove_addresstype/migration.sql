/*
  Warnings:

  - The `addressType` column on the `Verification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "addressType",
ADD COLUMN     "addressType" TEXT;
