"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { UpdateOperationalSettingsReturn, StoreOperationalSettingsForm } from "../types/operational-settings"
import { prisma } from "@/utils/prisma"

export async function updateStoreOperationalSettings(
    storeId: number, 
    settings: StoreOperationalSettingsForm
): Promise<UpdateOperationalSettingsReturn> {
    return actionWrapper(async () => {
        /* const client = new PrismaClient() */

        // Actualizar o crear la configuración operacional
        const operationalSettings = await prisma.storeOperationalSettings.upsert({
            where: {
                store_id: storeId
            },
            update: {
                // Delivery settings
                offers_delivery: settings.offers_delivery,
                delivery_price: settings.delivery_price,
                free_delivery_minimum: settings.free_delivery_minimum,
                delivery_radius_km: settings.delivery_radius_km,
                
                // Business hours
                monday_open: settings.monday_open,
                monday_close: settings.monday_close,
                tuesday_open: settings.tuesday_open,
                tuesday_close: settings.tuesday_close,
                wednesday_open: settings.wednesday_open,
                wednesday_close: settings.wednesday_close,
                thursday_open: settings.thursday_open,
                thursday_close: settings.thursday_close,
                friday_open: settings.friday_open,
                friday_close: settings.friday_close,
                saturday_open: settings.saturday_open,
                saturday_close: settings.saturday_close,
                sunday_open: settings.sunday_open,
                sunday_close: settings.sunday_close,
                
                // Delivery and pickup times
                delivery_time_min: settings.delivery_time_min,
                delivery_time_max: settings.delivery_time_max,
                pickup_time_min: settings.pickup_time_min,
                pickup_time_max: settings.pickup_time_max,
                
                // Payment methods
                payment_methods: settings.payment_methods,
                
                // Additional settings
                requires_phone_for_delivery: settings.requires_phone_for_delivery,
                minimum_order_amount: settings.minimum_order_amount,
                preparation_time_buffer: settings.preparation_time_buffer,
                is_temporarily_closed: settings.is_temporarily_closed,
                temporary_closure_reason: settings.temporary_closure_reason
            },
            create: {
                store_id: storeId,
                // Delivery settings
                offers_delivery: settings.offers_delivery,
                delivery_price: settings.delivery_price,
                free_delivery_minimum: settings.free_delivery_minimum,
                delivery_radius_km: settings.delivery_radius_km,
                
                // Business hours
                monday_open: settings.monday_open,
                monday_close: settings.monday_close,
                tuesday_open: settings.tuesday_open,
                tuesday_close: settings.tuesday_close,
                wednesday_open: settings.wednesday_open,
                wednesday_close: settings.wednesday_close,
                thursday_open: settings.thursday_open,
                thursday_close: settings.thursday_close,
                friday_open: settings.friday_open,
                friday_close: settings.friday_close,
                saturday_open: settings.saturday_open,
                saturday_close: settings.saturday_close,
                sunday_open: settings.sunday_open,
                sunday_close: settings.sunday_close,
                
                // Delivery and pickup times
                delivery_time_min: settings.delivery_time_min,
                delivery_time_max: settings.delivery_time_max,
                pickup_time_min: settings.pickup_time_min,
                pickup_time_max: settings.pickup_time_max,
                
                // Payment methods
                payment_methods: settings.payment_methods,
                
                // Additional settings
                requires_phone_for_delivery: settings.requires_phone_for_delivery,
                minimum_order_amount: settings.minimum_order_amount,
                preparation_time_buffer: settings.preparation_time_buffer,
                is_temporarily_closed: settings.is_temporarily_closed,
                temporary_closure_reason: settings.temporary_closure_reason
            }
        })

        return {
            message: "Store operational settings updated successfully",
            payload: operationalSettings,
            error: false
        }
    })
} 