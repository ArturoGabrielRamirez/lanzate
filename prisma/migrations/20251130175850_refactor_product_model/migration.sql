/*
  Warnings:

  - You are about to drop the column `available_for_sale` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `available_from` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `available_until` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `color_id` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `compare_price` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `country_of_origin` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `custom_attributes` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `depth_unit` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `diameter` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `diameter_unit` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `digital_file_url` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `discount_amount` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `discount_end` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `discount_start` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `discount_type` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `height_unit` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `is_digital` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `is_featured` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `is_published` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `is_visible` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `low_stock_alert` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `max_per_order` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `measure` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `min_wholesale_qty` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `pattern` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `primary_media_id` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `requires_shipping` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_depth` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_height` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_weight` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_width` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `style` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `wholesale_price` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `width_unit` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `barcode` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `depth` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `depth_unit` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `diameter` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `diameter_unit` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `expiration_date` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `height_unit` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `is_published` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `weight_unit` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `width_unit` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `_CategoryToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `colors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `default_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_stocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_variant_stocks` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `price` on table `product_variants` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PHYSICAL', 'DIGITAL', 'SERVICE');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "public"."_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."colors" DROP CONSTRAINT "colors_store_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_stocks" DROP CONSTRAINT "product_stocks_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_stocks" DROP CONSTRAINT "product_stocks_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_variant_stocks" DROP CONSTRAINT "product_variant_stocks_branch_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_variant_stocks" DROP CONSTRAINT "product_variant_stocks_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_variants" DROP CONSTRAINT "product_variants_color_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_variants" DROP CONSTRAINT "product_variants_primary_media_id_fkey";

-- DropIndex
DROP INDEX "public"."product_variants_primary_media_id_key";

-- DropIndex
DROP INDEX "public"."product_variants_product_id_idx";

-- DropIndex
DROP INDEX "public"."product_variants_product_id_size_color_id_key";

-- DropIndex
DROP INDEX "public"."product_variants_sku_key";

-- DropIndex
DROP INDEX "public"."products_sku_key";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "google_category" TEXT,
ADD COLUMN     "parent_id" INTEGER,
ADD COLUMN     "seo_description" TEXT,
ADD COLUMN     "seo_title" TEXT;

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "available_for_sale",
DROP COLUMN "available_from",
DROP COLUMN "available_until",
DROP COLUMN "color_id",
DROP COLUMN "compare_price",
DROP COLUMN "country_of_origin",
DROP COLUMN "custom_attributes",
DROP COLUMN "depth_unit",
DROP COLUMN "description",
DROP COLUMN "diameter",
DROP COLUMN "diameter_unit",
DROP COLUMN "digital_file_url",
DROP COLUMN "discount_amount",
DROP COLUMN "discount_end",
DROP COLUMN "discount_start",
DROP COLUMN "discount_type",
DROP COLUMN "height_unit",
DROP COLUMN "is_deleted",
DROP COLUMN "is_digital",
DROP COLUMN "is_featured",
DROP COLUMN "is_published",
DROP COLUMN "is_visible",
DROP COLUMN "low_stock_alert",
DROP COLUMN "material",
DROP COLUMN "max_per_order",
DROP COLUMN "measure",
DROP COLUMN "min_wholesale_qty",
DROP COLUMN "name",
DROP COLUMN "pattern",
DROP COLUMN "primary_media_id",
DROP COLUMN "requires_shipping",
DROP COLUMN "shipping_depth",
DROP COLUMN "shipping_height",
DROP COLUMN "shipping_weight",
DROP COLUMN "shipping_width",
DROP COLUMN "size",
DROP COLUMN "style",
DROP COLUMN "wholesale_price",
DROP COLUMN "width_unit",
ADD COLUMN     "dimension_unit" "LengthUnit",
ADD COLUMN     "is_default" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "media_id" INTEGER,
ADD COLUMN     "promotional_price" DOUBLE PRECISION,
ADD COLUMN     "show_price" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stock_unlimited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "track_stock" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "price" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "barcode",
DROP COLUMN "depth",
DROP COLUMN "depth_unit",
DROP COLUMN "diameter",
DROP COLUMN "diameter_unit",
DROP COLUMN "expiration_date",
DROP COLUMN "height",
DROP COLUMN "height_unit",
DROP COLUMN "image",
DROP COLUMN "is_active",
DROP COLUMN "is_deleted",
DROP COLUMN "is_published",
DROP COLUMN "price",
DROP COLUMN "sku",
DROP COLUMN "stock",
DROP COLUMN "video",
DROP COLUMN "weight",
DROP COLUMN "weight_unit",
DROP COLUMN "width",
DROP COLUMN "width_unit",
ADD COLUMN     "allow_promotions" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "free_shipping" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_new" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_on_sale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "seo_description" TEXT,
ADD COLUMN     "seo_title" TEXT,
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'PHYSICAL';

-- DropTable
DROP TABLE "public"."_CategoryToProduct";

-- DropTable
DROP TABLE "public"."colors";

-- DropTable
DROP TABLE "public"."default_categories";

-- DropTable
DROP TABLE "public"."product_stocks";

-- DropTable
DROP TABLE "public"."product_variant_stocks";

-- CreateTable
CREATE TABLE "product_options" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "product_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_option_values" (
    "id" SERIAL NOT NULL,
    "option_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "swatch_color" TEXT,
    "swatch_image" TEXT,

    CONSTRAINT "product_option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_values" (
    "variant_id" INTEGER NOT NULL,
    "option_value_id" INTEGER NOT NULL,

    CONSTRAINT "product_variant_values_pkey" PRIMARY KEY ("variant_id","option_value_id")
);

-- CreateTable
CREATE TABLE "variant_stocks" (
    "id" SERIAL NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "variant_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "variant_stocks_variant_id_branch_id_key" ON "variant_stocks"("variant_id", "branch_id");

-- CreateIndex
CREATE INDEX "_ProductCategories_B_index" ON "_ProductCategories"("B");

-- AddForeignKey
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_option_values" ADD CONSTRAINT "product_option_values_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "product_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "product_medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_values" ADD CONSTRAINT "product_variant_values_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_values" ADD CONSTRAINT "product_variant_values_option_value_id_fkey" FOREIGN KEY ("option_value_id") REFERENCES "product_option_values"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_stocks" ADD CONSTRAINT "variant_stocks_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_stocks" ADD CONSTRAINT "variant_stocks_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
