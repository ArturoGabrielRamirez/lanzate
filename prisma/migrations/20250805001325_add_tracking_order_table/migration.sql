-- CreateEnum
CREATE TYPE "OrderTrackingStatus" AS ENUM ('PREPARING_ORDER', 'WAITING_FOR_PICKUP', 'PICKED_UP', 'WAITING_FOR_DELIVERY', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "email_change_requests" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "old_email" TEXT NOT NULL,
    "new_email" TEXT NOT NULL,
    "old_email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "new_email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "old_email_confirmed_at" TIMESTAMP(3),
    "new_email_confirmed_at" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_change_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_tracking" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "tracking_status" "OrderTrackingStatus" NOT NULL DEFAULT 'PREPARING_ORDER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_change_requests_completed_idx" ON "email_change_requests"("completed");

-- CreateIndex
CREATE INDEX "email_change_requests_expires_at_idx" ON "email_change_requests"("expires_at");

-- CreateIndex
CREATE INDEX "email_change_requests_user_id_idx" ON "email_change_requests"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_tracking_order_id_key" ON "order_tracking"("order_id");

-- AddForeignKey
ALTER TABLE "email_change_requests" ADD CONSTRAINT "email_change_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_tracking" ADD CONSTRAINT "order_tracking_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
