-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'MERCADO_PAGO', 'PAYPAL', 'CRYPTO');

-- CreateTable
CREATE TABLE "store_operational_settings" (
    "id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "offers_delivery" BOOLEAN NOT NULL DEFAULT false,
    "delivery_price" DOUBLE PRECISION DEFAULT 0,
    "free_delivery_minimum" DOUBLE PRECISION,
    "delivery_radius_km" DOUBLE PRECISION DEFAULT 5,
    "monday_open" TEXT,
    "monday_close" TEXT,
    "tuesday_open" TEXT,
    "tuesday_close" TEXT,
    "wednesday_open" TEXT,
    "wednesday_close" TEXT,
    "thursday_open" TEXT,
    "thursday_close" TEXT,
    "friday_open" TEXT,
    "friday_close" TEXT,
    "saturday_open" TEXT,
    "saturday_close" TEXT,
    "sunday_open" TEXT,
    "sunday_close" TEXT,
    "delivery_time_min" INTEGER DEFAULT 30,
    "delivery_time_max" INTEGER DEFAULT 60,
    "pickup_time_min" INTEGER DEFAULT 15,
    "pickup_time_max" INTEGER DEFAULT 30,
    "payment_methods" "PaymentMethod"[] DEFAULT ARRAY['CASH']::"PaymentMethod"[],
    "requires_phone_for_delivery" BOOLEAN NOT NULL DEFAULT true,
    "minimum_order_amount" DOUBLE PRECISION DEFAULT 0,
    "preparation_time_buffer" INTEGER DEFAULT 10,
    "is_temporarily_closed" BOOLEAN NOT NULL DEFAULT false,
    "temporary_closure_reason" TEXT,
    "contact_phone" TEXT,
    "contact_whatsapp" TEXT,
    "contact_email" TEXT,
    "delivery_instructions" TEXT,
    "pickup_instructions" TEXT,
    "special_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_operational_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_operational_settings_store_id_key" ON "store_operational_settings"("store_id");

-- AddForeignKey
ALTER TABLE "store_operational_settings" ADD CONSTRAINT "store_operational_settings_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
