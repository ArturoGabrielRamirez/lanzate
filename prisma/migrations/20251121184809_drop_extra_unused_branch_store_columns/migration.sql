/*
  Warnings:

  - You are about to drop the column `delivery_time_max` on the `branch_operational_settings` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_time_min` on the `branch_operational_settings` table. All the data in the column will be lost.
  - You are about to drop the column `is_temporarily_closed` on the `branch_operational_settings` table. All the data in the column will be lost.
  - You are about to drop the column `minimum_order_amount` on the `branch_operational_settings` table. All the data in the column will be lost.
  - You are about to drop the column `pickup_time_max` on the `branch_operational_settings` table. All the data in the column will be lost.
  - You are about to drop the column `pickup_time_min` on the `branch_operational_settings` table. All the data in the column will be lost.
  - You are about to drop the column `preparation_time_buffer` on the `branch_operational_settings` table. All the data in the column will be lost.
  - You are about to drop the column `requires_phone_for_delivery` on the `branch_operational_settings` table. All the data in the column will be lost.
  - You are about to drop the column `temporary_closure_reason` on the `branch_operational_settings` table. All the data in the column will be lost.
  - You are about to drop the column `eta_minutes` on the `branch_shipping_methods` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "branch_operational_settings" DROP COLUMN "delivery_time_max",
DROP COLUMN "delivery_time_min",
DROP COLUMN "is_temporarily_closed",
DROP COLUMN "minimum_order_amount",
DROP COLUMN "pickup_time_max",
DROP COLUMN "pickup_time_min",
DROP COLUMN "preparation_time_buffer",
DROP COLUMN "requires_phone_for_delivery",
DROP COLUMN "temporary_closure_reason";

-- AlterTable
ALTER TABLE "branch_shipping_methods" DROP COLUMN "eta_minutes",
ALTER COLUMN "min_order_amount" SET DEFAULT 0,
ALTER COLUMN "free_shipping_min" SET DEFAULT 0,
ALTER COLUMN "delivery_price" SET DEFAULT 0;
