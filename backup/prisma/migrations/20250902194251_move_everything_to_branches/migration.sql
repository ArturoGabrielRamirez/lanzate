/*
  Warnings:

  - You are about to drop the column `email` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `facebook_url` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `instagram_url` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `x_url` on the `stores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stores" DROP COLUMN "email",
DROP COLUMN "facebook_url",
DROP COLUMN "instagram_url",
DROP COLUMN "phone",
DROP COLUMN "x_url";

-- CreateTable
CREATE TABLE "branch_operational_settings" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "is_open_24_hours" BOOLEAN NOT NULL DEFAULT true,
    "offers_delivery" BOOLEAN NOT NULL DEFAULT false,
    "payment_methods" "PaymentMethod"[] DEFAULT ARRAY['CASH']::"PaymentMethod"[],
    "delivery_time_min" INTEGER DEFAULT 30,
    "delivery_time_max" INTEGER DEFAULT 60,
    "pickup_time_min" INTEGER DEFAULT 15,
    "pickup_time_max" INTEGER DEFAULT 30,
    "requires_phone_for_delivery" BOOLEAN NOT NULL DEFAULT true,
    "minimum_order_amount" DOUBLE PRECISION DEFAULT 0,
    "preparation_time_buffer" INTEGER DEFAULT 10,
    "is_temporarily_closed" BOOLEAN NOT NULL DEFAULT false,
    "temporary_closure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_operational_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_opening_hours" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_opening_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_shipping_methods" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "min_order_amount" DOUBLE PRECISION,
    "free_shipping_min" DOUBLE PRECISION,
    "eta_minutes" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_shipping_methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branch_operational_settings_branch_id_key" ON "branch_operational_settings"("branch_id");

-- CreateIndex
CREATE INDEX "branch_opening_hours_branch_id_day_idx" ON "branch_opening_hours"("branch_id", "day");

-- CreateIndex
CREATE INDEX "branch_shipping_methods_branch_id_provider_idx" ON "branch_shipping_methods"("branch_id", "provider");

-- AddForeignKey
ALTER TABLE "branch_operational_settings" ADD CONSTRAINT "branch_operational_settings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_opening_hours" ADD CONSTRAINT "branch_opening_hours_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_shipping_methods" ADD CONSTRAINT "branch_shipping_methods_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
