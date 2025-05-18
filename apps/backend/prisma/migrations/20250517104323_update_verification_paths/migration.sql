/*
  Warnings:

  - You are about to drop the column `path` on the `Verification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "path",
ADD COLUMN     "paths" TEXT[];
