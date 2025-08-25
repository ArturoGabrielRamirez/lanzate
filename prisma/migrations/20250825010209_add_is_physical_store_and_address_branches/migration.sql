-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "province" TEXT;

-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "is_physical_store" BOOLEAN NOT NULL DEFAULT false;
