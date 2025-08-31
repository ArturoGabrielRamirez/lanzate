"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

type UpdateVariantPricePayload = {
    price: number | null
}

export async function updateVariantPrice(variantId: number, data: UpdateVariantPricePayload) {
    return actionWrapper(async () => {
        const variant = await prisma.productVariant.update({
            where: { id: variantId },
            data: {
                price: data.price
            }
        })

        return { 
            error: false, 
            message: data.price ? "Precio actualizado correctamente" : "Se restableció el precio base del producto",
            payload: variant 
        }
    })
}
