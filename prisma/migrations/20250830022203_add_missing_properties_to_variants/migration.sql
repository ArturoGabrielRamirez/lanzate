/*
  Warnings:

  - You are about to drop the column `dimension_group` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `size_or_measure` on the `product_variants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_id,size,color_id]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'SPECIAL');

-- DropIndex
DROP INDEX "product_variants_product_id_size_or_measure_color_id_key";

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "dimension_group",
DROP COLUMN "size_or_measure",
ADD COLUMN     "available_for_sale" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "available_from" TIMESTAMP(3),
ADD COLUMN     "available_until" TIMESTAMP(3),
ADD COLUMN     "compare_price" DOUBLE PRECISION,
ADD COLUMN     "cost_price" DOUBLE PRECISION,
ADD COLUMN     "country_of_origin" TEXT,
ADD COLUMN     "custom_attributes" JSONB,
ADD COLUMN     "depth" DOUBLE PRECISION,
ADD COLUMN     "depth_unit" "LengthUnit",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "diameter" DOUBLE PRECISION,
ADD COLUMN     "diameter_unit" "LengthUnit",
ADD COLUMN     "digital_file_url" TEXT,
ADD COLUMN     "discount_amount" DOUBLE PRECISION,
ADD COLUMN     "discount_end" TIMESTAMP(3),
ADD COLUMN     "discount_start" TIMESTAMP(3),
ADD COLUMN     "discount_type" "DiscountType",
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "height_unit" "LengthUnit",
ADD COLUMN     "is_digital" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_visible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "low_stock_alert" INTEGER,
ADD COLUMN     "material" TEXT,
ADD COLUMN     "max_per_order" INTEGER,
ADD COLUMN     "min_wholesale_qty" INTEGER,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "pattern" TEXT,
ADD COLUMN     "requires_shipping" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "shipping_depth" DOUBLE PRECISION,
ADD COLUMN     "shipping_height" DOUBLE PRECISION,
ADD COLUMN     "shipping_weight" DOUBLE PRECISION,
ADD COLUMN     "shipping_width" DOUBLE PRECISION,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "style" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION,
ADD COLUMN     "weight_unit" "WeightUnit",
ADD COLUMN     "wholesale_price" DOUBLE PRECISION,
ADD COLUMN     "width" DOUBLE PRECISION,
ADD COLUMN     "width_unit" "LengthUnit";

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_product_id_size_color_id_key" ON "product_variants"("product_id", "size", "color_id");
