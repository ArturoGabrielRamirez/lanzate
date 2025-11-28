/*
  Warnings:

  - You are about to drop the column `offers_delivery` on the `branch_operational_settings` table. All the data in the column will be lost.
  - You are about to drop the column `payment_methods` on the `branch_operational_settings` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `facebook_url` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `instagram_url` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `x_url` on the `branches` table. All the data in the column will be lost.
  - You are about to drop the column `is_physical_store` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the `store_operational_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "store_operational_settings" DROP CONSTRAINT "store_operational_settings_store_id_fkey";

-- AlterTable
ALTER TABLE "branch_operational_settings" DROP COLUMN "offers_delivery",
DROP COLUMN "payment_methods";

-- AlterTable
ALTER TABLE "branches" DROP COLUMN "email",
DROP COLUMN "facebook_url",
DROP COLUMN "instagram_url",
DROP COLUMN "phone",
DROP COLUMN "x_url";

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "is_physical_store";

-- DropTable
DROP TABLE "store_operational_settings";

-- CreateTable
CREATE TABLE "branch_phones" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'mobile',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_phones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_emails" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'contact',
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_social_medias" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "handle" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_social_medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_payment_configs" (
    "id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "type" "PaymentMethod" NOT NULL,
    "name" TEXT NOT NULL,
    "details" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "commission_percent" DOUBLE PRECISION DEFAULT 0,
    "commission_amount" DOUBLE PRECISION DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_payment_configs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "branch_phones" ADD CONSTRAINT "branch_phones_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_emails" ADD CONSTRAINT "branch_emails_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_social_medias" ADD CONSTRAINT "branch_social_medias_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_payment_configs" ADD CONSTRAINT "branch_payment_configs_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
