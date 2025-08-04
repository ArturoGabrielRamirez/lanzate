-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('CUSTOMER_TO_STORE', 'STORE_TO_CUSTOMER', 'SYSTEM');

-- CreateTable
CREATE TABLE "order_messages" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "message_type" "MessageType" NOT NULL DEFAULT 'CUSTOMER_TO_STORE',
    "file_url" TEXT,
    "file_name" TEXT,
    "file_size" INTEGER,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_messages" ADD CONSTRAINT "order_messages_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_messages" ADD CONSTRAINT "order_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;