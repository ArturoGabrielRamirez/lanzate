/*
  Warnings:

  - Changed the type of `type` on the `notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'PRODUCT_LIKE', 'PRODUCT_COMMENT', 'PRODUCT_DELETED', 'ORDER_CREATED', 'ORDER_COMPLETED', 'ORDER_FAILED', 'ORDER_CANCELLED', 'ORDER_REFUNDED', 'ORDER_SHIPPED', 'ORDER_PREPARING', 'ORDER_READY', 'ORDER_DELIVERED', 'ORDER_PICKED_UP', 'ORDER_ON_THE_WAY', 'CONTRACT_ASSIGNED', 'CONTRACT_APPROVED', 'CONTRACT_REJECTED', 'EMPLOYEE_HIRED', 'EMPLOYEE_FIRED', 'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'STORE_CREATED', 'STORE_UPDATED', 'STORE_DELETED', 'BRANCH_CREATED', 'BRANCH_UPDATED', 'BRANCH_DELETED', 'CATEGORY_CREATED', 'CATEGORY_UPDATED', 'CATEGORY_DELETED');

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "store_id" INTEGER,
DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
