"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { updateStoreShippingData } from "@/features/stores/data/update-store-shipping.data"
import { shippingSchema, ShippingFormType } from "@/features/stores/schemas"
import { processShippingMethods } from "@/features/stores/utils"

export async function updateStoreShippingAction(slug: string, data: ShippingFormType) {
    return actionWrapper(async () => {
        
        // 1. Validate input
        const validatedData = await shippingSchema.validate(data, { abortEarly: false })
        
        // 2. Process data
        const processedMethods = processShippingMethods(validatedData.shipping_info.methods)

        // 3. Update DB
        await updateStoreShippingData(slug, processedMethods)

        // 4. Revalidate
        revalidatePath(`/stores/${slug}`, "page")

        return {
            message: "Información de envíos actualizada con éxito",
            hasError: false,
            payload: null
        }
    })
}

