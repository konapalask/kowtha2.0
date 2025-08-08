/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Department" AS ENUM ('FI', 'PD');

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "department" "Department";

-- AlterTable
ALTER TABLE "EditRequest" ADD COLUMN     "department" "Department";

-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "department" "Department";

-- AlterTable
ALTER TABLE "Office" ADD COLUMN     "department" "Department";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "department" "Department";

-- CreateTable
CREATE TABLE "DepartmentRole" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "department" "Department" NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepartmentRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentRole_userId_department_key" ON "DepartmentRole"("userId", "department");

-- AddForeignKey
ALTER TABLE "DepartmentRole" ADD CONSTRAINT "DepartmentRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
