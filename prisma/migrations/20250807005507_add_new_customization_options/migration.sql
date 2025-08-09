/*
  Warnings:

  - The values [STICKY] on the enum `HeaderPosition` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "HeaderSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "HeaderRounded" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "FilterPosition" AS ENUM ('LEFT', 'RIGHT', 'TOP', 'BOTTOM');

-- CreateEnum
CREATE TYPE "FilterStyle" AS ENUM ('MODERN', 'CLASSIC', 'MINIMAL', 'BOLD');

-- AlterEnum
BEGIN;
CREATE TYPE "HeaderPosition_new" AS ENUM ('TOP', 'BOTTOM', 'LEFT', 'RIGHT', 'FIXED_TOP', 'FIXED_BOTTOM');
ALTER TABLE "store_customizations" ALTER COLUMN "header_position" DROP DEFAULT;
ALTER TABLE "store_customizations" ALTER COLUMN "header_position" TYPE "HeaderPosition_new" USING ("header_position"::text::"HeaderPosition_new");
ALTER TYPE "HeaderPosition" RENAME TO "HeaderPosition_old";
ALTER TYPE "HeaderPosition_new" RENAME TO "HeaderPosition";
DROP TYPE "HeaderPosition_old";
ALTER TABLE "store_customizations" ALTER COLUMN "header_position" SET DEFAULT 'TOP';
COMMIT;

-- AlterTable
ALTER TABLE "store_customizations" ADD COLUMN     "background_foreground_color" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "brand_text_color" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "filter_background_color" TEXT NOT NULL DEFAULT '#ffffff',
ADD COLUMN     "filter_position" "FilterPosition" NOT NULL DEFAULT 'LEFT',
ADD COLUMN     "filter_style" "FilterStyle" NOT NULL DEFAULT 'MODERN',
ADD COLUMN     "filter_text_color" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "header_color" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "header_floating" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "header_foreground_color" TEXT NOT NULL DEFAULT '#ffffff',
ADD COLUMN     "header_rounded" "HeaderRounded" NOT NULL DEFAULT 'SMALL',
ADD COLUMN     "header_size" "HeaderSize" NOT NULL DEFAULT 'SMALL',
ADD COLUMN     "product_card_background_color" TEXT NOT NULL DEFAULT '#ffffff',
ADD COLUMN     "product_card_text_color" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "show_brand_logo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_brand_text" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_categories_filter" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_filters" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_layout_switcher" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_main_searchbar" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_pagination_buttons" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_price_filter" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_searchbar_filter" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_sorting_filter" BOOLEAN NOT NULL DEFAULT true;
