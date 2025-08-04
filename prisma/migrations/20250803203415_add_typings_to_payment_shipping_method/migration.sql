/*
  Warnings:

  - The `shipping_method` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ShippingMethod" AS ENUM ('PICKUP', 'DELIVERY');

-- AlterEnum
ALTER TYPE "OrderPaymentStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "shipping_method",
ADD COLUMN     "shipping_method" "ShippingMethod" NOT NULL DEFAULT 'PICKUP';