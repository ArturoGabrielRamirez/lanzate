-- AlterTable
ALTER TABLE "users" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "profile_bio" TEXT,
ADD COLUMN     "profile_is_public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_activity" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_comments" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_liked_products" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_location" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "user_follows" (
    "id" SERIAL NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "following_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_follows_follower_id_following_id_key" ON "user_follows"("follower_id", "following_id");

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
