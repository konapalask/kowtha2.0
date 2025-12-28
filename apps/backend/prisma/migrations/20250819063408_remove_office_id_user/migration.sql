/*
  Warnings:

  - You are about to drop the column `officeId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_officeId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "officeId";
