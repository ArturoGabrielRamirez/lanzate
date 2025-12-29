/*
  Warnings:

  - You are about to drop the column `dimension_unit` on the `product_variants` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'JPG', 'JPEG', 'PNG', 'GIF', 'SVG', 'WEBP', 'AVIF', 'MP4', 'WEBM', 'MP3', 'WAV', 'OGG', 'AAC', 'M4A', 'M4V', 'MOV', 'WMV', 'AVI', 'FLV', 'SWF');

-- CreateEnum
CREATE TYPE "FileSizeUnit" AS ENUM ('BYTE', 'KILOBYTE', 'MEGABYTE', 'GIGABYTE');

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "dimension_unit",
ADD COLUMN     "depth_unit" "LengthUnit",
ADD COLUMN     "diameter" DOUBLE PRECISION,
ADD COLUMN     "diameter_unit" "LengthUnit",
ADD COLUMN     "expiration_date" TIMESTAMP(3),
ADD COLUMN     "file_name" TEXT,
ADD COLUMN     "file_size" INTEGER,
ADD COLUMN     "file_size_unit" "FileSizeUnit",
ADD COLUMN     "file_type" "FileType",
ADD COLUMN     "file_url" TEXT,
ADD COLUMN     "height_unit" "LengthUnit",
ADD COLUMN     "max_downloads" INTEGER,
ADD COLUMN     "width_unit" "LengthUnit";
