"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

type UpdateVariantFlagsPayload = {
    is_active: boolean
    is_published: boolean
    is_featured: boolean
}

export async function updateVariantFlags(variantId: number, data: UpdateVariantFlagsPayload) {
    return actionWrapper(async () => {
        const updated = await prisma.productVariant.update({
            where: { id: variantId },
            data: {
                is_active: data.is_active,
                is_published: data.is_published,
                is_featured: data.is_featured,
            }
        })

        return {
            error: false,
            message: "Configuración de la variante actualizada",
            payload: updated
        }
    })
}


