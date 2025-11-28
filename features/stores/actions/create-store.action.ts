"use server"

import { revalidatePath } from "next/cache"

import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { actionWrapper } from "@/features/global/utils"
import { insertStoreData } from "@/features/stores/data"
import { CreateStoreFormType } from "@/features/stores/schemas"
import { ProcessedCreateStoreData } from "@/features/stores/types"
import { processOpeningHours, processPaymentMethods, processShippingMethods } from "@/features/stores/utils"

export async function createStoreAction(payload: CreateStoreFormType, userId: number) {
    /* console.log("🚀 ~ createStoreAction ~ payload:", payload) */
    /* console.log("🚀 ~ createStoreAction ~ userId:", userId) */
    return actionWrapper(async () => {

        //Check user is authenticated
        if (!userId) throw new Error("Usuario no autenticado")

        //Check user account type allows store creation
        /* const canCreate = await canCreateStore(userId) */

        //Throw error if user's account is not allowed
        /* if (!canCreate) throw new Error("Se alcanzó el límite del plan gratuito para esta cuenta. Actualizá tu plan para crear más tiendas.") */

        const processedOpeningHours = processOpeningHours(payload.settings?.attention_dates?.map(d => ({
            ...d,
            days: d.days?.filter((day): day is string => !!day)
        })))
        const processedShippingMethods = processShippingMethods(payload.shipping_info?.methods?.map(m => ({
            ...m,
            providers: m.providers?.filter((p): p is string => !!p)
        })))
        
        // Extract types for the helper
        const paymentMethodTypes = payload.payment_info?.payment_methods?.map(pm => pm.type) || []
        const processedPaymentMethods = processPaymentMethods(paymentMethodTypes)

        //Create store record
        //Create default branch
        //Create store's initial balance
        const { payload: newStore, hasError, message } = await insertStoreData({
            ...payload,
            processedOpeningHours,
            processedShippingMethods,
            processedPaymentMethods
        } as ProcessedCreateStoreData, userId)

        //Throw error if store was not able to be created
        if (hasError || !newStore) throw new Error(message)

        revalidatePath("/stores")
        revalidatePath("/dashboard")

        // Create action log
        await insertLogEntry({
            action: "CREATE",
            entity_type: "STORE",
            entity_id: newStore.id,
            user_id: userId,
            action_initiator: "Se creó una nueva tienda",
            details: `El usuario creó la tienda ${newStore.name} (${newStore.slug})`
        })

        return {
            hasError: false,
            message: "Tienda creada exitosamente",
            payload: newStore
        }

    })
}
