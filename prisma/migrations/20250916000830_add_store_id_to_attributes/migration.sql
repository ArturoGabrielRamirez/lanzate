/*
  Warnings:

  - Added the required column `store_id` to the `dimensions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `flavors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `fragrances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `sizes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dimensions" ADD COLUMN     "store_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "flavors" ADD COLUMN     "store_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "fragrances" ADD COLUMN     "store_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "materials" ADD COLUMN     "store_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "sizes" ADD COLUMN     "store_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "sizes" ADD CONSTRAINT "sizes_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dimensions" ADD CONSTRAINT "dimensions_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flavors" ADD CONSTRAINT "flavors_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fragrances" ADD CONSTRAINT "fragrances_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
