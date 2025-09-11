/*
  Warnings:

  - A unique constraint covering the columns `[hex]` on the table `colors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id,color_id,sizes_id,dimensions_id,material_id,flavor_id,fragrance_id]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "product_variants_product_id_size_color_id_key";

-- AlterTable
ALTER TABLE "colors" ADD COLUMN     "hex" TEXT;

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "dimensions_id" INTEGER,
ADD COLUMN     "flavor_id" INTEGER,
ADD COLUMN     "fragrance_id" INTEGER,
ADD COLUMN     "material_id" INTEGER,
ADD COLUMN     "sizes_id" INTEGER;

-- CreateTable
CREATE TABLE "sizes" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dimensions" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "unit" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dimensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flavors" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flavors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fragrances" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fragrances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sizes_label_key" ON "sizes"("label");

-- CreateIndex
CREATE UNIQUE INDEX "dimensions_label_key" ON "dimensions"("label");

-- CreateIndex
CREATE UNIQUE INDEX "materials_label_key" ON "materials"("label");

-- CreateIndex
CREATE UNIQUE INDEX "flavors_label_key" ON "flavors"("label");

-- CreateIndex
CREATE UNIQUE INDEX "fragrances_label_key" ON "fragrances"("label");

-- CreateIndex
CREATE UNIQUE INDEX "colors_hex_key" ON "colors"("hex");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_product_id_color_id_sizes_id_dimensions_id_key" ON "product_variants"("product_id", "color_id", "sizes_id", "dimensions_id", "material_id", "flavor_id", "fragrance_id");

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_sizes_id_fkey" FOREIGN KEY ("sizes_id") REFERENCES "sizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_dimensions_id_fkey" FOREIGN KEY ("dimensions_id") REFERENCES "dimensions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "materials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_flavor_id_fkey" FOREIGN KEY ("flavor_id") REFERENCES "flavors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_fragrance_id_fkey" FOREIGN KEY ("fragrance_id") REFERENCES "fragrances"("id") ON DELETE SET NULL ON UPDATE CASCADE;
