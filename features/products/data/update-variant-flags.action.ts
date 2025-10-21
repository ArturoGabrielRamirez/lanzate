"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { revalidatePath } from "next/cache"

type UpdateVariantFlagsPayload = {
    is_active: boolean
    is_published: boolean
    is_featured: boolean
}

export async function updateVariantFlagsAction(variantId: number, data: UpdateVariantFlagsPayload) {
    return actionWrapper(async () => {
        const updated = await prisma.productVariant.update({
            where: { id: variantId },
            data: {
                is_active: data.is_active,
                is_published: data.is_published,
                is_featured: data.is_featured,
            }
        })

        const ref = await prisma.productVariant.findUnique({
            where: { id: variantId },
            select: { product: { select: { id: true, store: { select: { slug: true } } } } }
        })
        if (ref?.product?.store?.slug && ref.product.id) {
            revalidatePath(`/stores/${ref.product.store.slug}/products/${ref.product.id}/${variantId}`, "page")
        }

        return {
            error: false,
            message: "Configuración de la variante actualizada",
            payload: updated
        }
    })
}


