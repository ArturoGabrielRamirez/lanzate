-- CreateEnum
CREATE TYPE "LengthUnit" AS ENUM ('MM', 'CM', 'M', 'IN', 'FT');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('G', 'KG', 'LB', 'OZ');

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "variant_id" INTEGER;

-- AlterTable
ALTER TABLE "product_medias" ADD COLUMN     "product_variant_id" INTEGER;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "depth" DOUBLE PRECISION,
ADD COLUMN     "depth_unit" "LengthUnit",
ADD COLUMN     "diameter" DOUBLE PRECISION,
ADD COLUMN     "diameter_unit" "LengthUnit",
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "height_unit" "LengthUnit",
ADD COLUMN     "weight" DOUBLE PRECISION,
ADD COLUMN     "weight_unit" "WeightUnit",
ADD COLUMN     "width" DOUBLE PRECISION,
ADD COLUMN     "width_unit" "LengthUnit";

-- CreateTable
CREATE TABLE "colors" (
    "id" SERIAL NOT NULL,
    "store_id" INTEGER,
    "name" TEXT NOT NULL,
    "rgba" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "sku" TEXT,
    "size_or_measure" TEXT,
    "dimension_group" TEXT,
    "color_id" INTEGER,
    "price" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "barcode" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "primary_media_id" INTEGER,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_stocks" (
    "variant_id" INTEGER NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variant_stocks_pkey" PRIMARY KEY ("variant_id","branch_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_primary_media_id_key" ON "product_variants"("primary_media_id");

-- CreateIndex
CREATE INDEX "product_variants_product_id_idx" ON "product_variants"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_product_id_size_or_measure_color_id_key" ON "product_variants"("product_id", "size_or_measure", "color_id");

-- CreateIndex
CREATE INDEX "order_items_variant_id_idx" ON "order_items"("variant_id");

-- CreateIndex
CREATE INDEX "product_medias_product_variant_id_sort_order_idx" ON "product_medias"("product_variant_id", "sort_order");

-- AddForeignKey
ALTER TABLE "colors" ADD CONSTRAINT "colors_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_primary_media_id_fkey" FOREIGN KEY ("primary_media_id") REFERENCES "product_medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_stocks" ADD CONSTRAINT "product_variant_stocks_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_stocks" ADD CONSTRAINT "product_variant_stocks_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_medias" ADD CONSTRAINT "product_medias_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
