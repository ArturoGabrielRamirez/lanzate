-- AlterTable
ALTER TABLE "social_activities" ADD COLUMN     "employee_id" INTEGER,
ADD COLUMN     "product_id" INTEGER;

-- AddForeignKey
ALTER TABLE "social_activities" ADD CONSTRAINT "social_activities_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_activities" ADD CONSTRAINT "social_activities_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
