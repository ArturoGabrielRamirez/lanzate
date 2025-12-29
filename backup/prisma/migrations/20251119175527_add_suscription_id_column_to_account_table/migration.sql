/*
  Warnings:

  - A unique constraint covering the columns `[suscription_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "suscription_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_suscription_id_key" ON "accounts"("suscription_id");
