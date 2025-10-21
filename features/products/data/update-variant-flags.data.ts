"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/utils/prisma"

type UpdateVariantFlagsPayload = {
    is_active: boolean
    is_published: boolean
    is_featured: boolean
}

export async function updateVariantFlagsData(variantId: number, data: UpdateVariantFlagsPayload) {
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
        hasError: false,
        message: "Configuración de la variante actualizada",
        payload: updated
    }
}


