-- AlterTable
ALTER TABLE "social_activities" ADD COLUMN     "order_id" INTEGER;

-- AddForeignKey
ALTER TABLE "social_activities" ADD CONSTRAINT "social_activities_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
