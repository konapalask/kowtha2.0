/*
  Warnings:

  - You are about to drop the column `financialAnalysis` on the `Verification` table. All the data in the column will be lost.
  - You are about to drop the column `synopsis` on the `Verification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Verification" DROP COLUMN "financialAnalysis",
DROP COLUMN "synopsis";
