/*
  Warnings:

  - The primary key for the `email_change_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `email_change_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrderTrackingStatus" AS ENUM ('PREPARING_ORDER', 'WAITING_FOR_PICKUP', 'PICKED_UP', 'WAITING_FOR_DELIVERY', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActionType" ADD VALUE 'EMAIL_CHANGE_REQUEST';
ALTER TYPE "ActionType" ADD VALUE 'EMAIL_CONFIRMATION';

-- AlterEnum
ALTER TYPE "EntityType" ADD VALUE 'EMAIL_CHANGE_REQUEST';

-- AlterTable
ALTER TABLE "email_change_requests" DROP CONSTRAINT "email_change_requests_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "email_change_requests_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "order_tracking" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "tracking_status" "OrderTrackingStatus" NOT NULL DEFAULT 'PREPARING_ORDER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_tracking_order_id_key" ON "order_tracking"("order_id");

-- AddForeignKey
ALTER TABLE "order_tracking" ADD CONSTRAINT "order_tracking_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
