/*
  Warnings:

  - The `payment_method` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('CASH_REGISTER', 'PUBLIC_STORE');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "order_type" "OrderType" NOT NULL DEFAULT 'CASH_REGISTER',
DROP COLUMN "payment_method",
ADD COLUMN     "payment_method" "PaymentMethod" DEFAULT 'CASH';
