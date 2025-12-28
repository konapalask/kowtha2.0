-- AlterTable
ALTER TABLE "public"."DepartmentRole" ADD COLUMN     "officeId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."DepartmentRole" ADD CONSTRAINT "DepartmentRole_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "public"."Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;
