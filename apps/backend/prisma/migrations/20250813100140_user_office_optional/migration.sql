-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_officeId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "officeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "public"."Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;
