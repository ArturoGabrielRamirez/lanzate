-- AlterTable
ALTER TABLE "users" ADD COLUMN     "account_locked_until" TIMESTAMP(3),
ADD COLUMN     "anonymized_at" TIMESTAMP(3),
ADD COLUMN     "deletion_cancelled_at" TIMESTAMP(3),
ADD COLUMN     "deletion_cancelled_reason" TEXT,
ADD COLUMN     "deletion_ip_address" TEXT,
ADD COLUMN     "deletion_reason" TEXT,
ADD COLUMN     "deletion_requested_at" TIMESTAMP(3),
ADD COLUMN     "deletion_scheduled_at" TIMESTAMP(3),
ADD COLUMN     "deletion_user_agent" TEXT,
ADD COLUMN     "is_anonymized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_deletion_cancelled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "login_attempts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "original_email_hash" TEXT;

-- CreateTable
CREATE TABLE "user_deletion_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "additional_data" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_deletion_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_deletion_logs" ADD CONSTRAINT "user_deletion_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
