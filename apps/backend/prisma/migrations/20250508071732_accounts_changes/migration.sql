/*
  Warnings:

  - You are about to drop the column `name` on the `Document` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ID', 'Address', 'Income', 'Other');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "name",
DROP COLUMN "type",
ADD COLUMN     "type" "DocumentType" NOT NULL;
