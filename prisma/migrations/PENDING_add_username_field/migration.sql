-- AlterTable
ALTER TABLE "users" ADD COLUMN "username" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
