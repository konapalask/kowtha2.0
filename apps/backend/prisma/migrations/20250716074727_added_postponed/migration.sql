-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "isPostponed" BOOLEAN,
ADD COLUMN     "postponedDate" TIMESTAMP(3);
