/*
  Warnings:

  - You are about to drop the column `slug` on the `stores` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subdomain]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subdomain` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_owner_id_fkey";

-- DropIndex
DROP INDEX "stores_slug_key";

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "slug",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "subdomain" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "account_type" "AccountType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "stores_subdomain_key" ON "stores"("subdomain");

-- CreateIndex
CREATE INDEX "stores_subdomain_idx" ON "stores"("subdomain");

-- CreateIndex
CREATE INDEX "stores_owner_id_idx" ON "stores"("owner_id");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
