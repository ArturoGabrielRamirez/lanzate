/*
  Warnings:

  - A unique constraint covering the columns `[primary_media_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "primary_media_id" INTEGER;

-- CreateTable
CREATE TABLE "product_medias" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_medias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_medias_product_id_sort_order_idx" ON "product_medias"("product_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "products_primary_media_id_key" ON "products"("primary_media_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_primary_media_id_fkey" FOREIGN KEY ("primary_media_id") REFERENCES "product_medias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_medias" ADD CONSTRAINT "product_medias_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
