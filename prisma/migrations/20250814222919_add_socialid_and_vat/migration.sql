/*
  Warnings:

  - A unique constraint covering the columns `[government_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SocialActivityType" AS ENUM ('PRODUCT_LIKE', 'PRODUCT_COMMENT', 'ORDER_CREATED', 'ORDER_COMPLETED', 'CONTRACT_ASSIGNED', 'CONTRACT_APPROVED', 'CONTRACT_REJECTED', 'EMPLOYEE_HIRED', 'EMPLOYEE_FIRED', 'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'STORE_CREATED', 'STORE_UPDATED', 'TRANSACTION_CREATED', 'REMINDER_COMPLETED', 'USER_REGISTERED', 'USER_LOGIN', 'STORE_REVIEW', 'PRODUCT_REVIEW', 'ACHIEVEMENT_UNLOCKED', 'MILESTONE_REACHED');

-- AlterTable
ALTER TABLE "store_operational_settings" ADD COLUMN     "country_tax_amount" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "government_id" TEXT;

-- CreateTable
CREATE TABLE "social_activities" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "store_id" INTEGER,
    "activity_type" "SocialActivityType" NOT NULL,
    "entity_type" "EntityType" NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "social_activities_user_id_idx" ON "social_activities"("user_id");

-- CreateIndex
CREATE INDEX "social_activities_store_id_idx" ON "social_activities"("store_id");

-- CreateIndex
CREATE INDEX "social_activities_entity_type_idx" ON "social_activities"("entity_type");

-- CreateIndex
CREATE INDEX "social_activities_created_at_idx" ON "social_activities"("created_at");

-- CreateIndex
CREATE INDEX "social_activities_is_public_idx" ON "social_activities"("is_public");

-- CreateIndex
CREATE INDEX "social_activities_is_featured_idx" ON "social_activities"("is_featured");

-- CreateIndex
CREATE UNIQUE INDEX "users_government_id_key" ON "users"("government_id");

-- AddForeignKey
ALTER TABLE "social_activities" ADD CONSTRAINT "social_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_activities" ADD CONSTRAINT "social_activities_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
