"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/utils/prisma"

export async function updateVariantColor(variantId: number, colorId: number | null) {
    const updated = await prisma.productVariant.update({
        where: { id: variantId },
        data: { color_id: colorId }
    })

    const ref = await prisma.productVariant.findUnique({
        where: { id: variantId },
        select: { product: { select: { id: true, store: { select: { slug: true } } } } }
    })
    if (ref?.product?.store?.slug && ref.product.id) {
        revalidatePath(`/stores/${ref.product.store.slug}/products/${ref.product.id}/${variantId}`, "page")
    }

    return { hasError: false, message: "Color de variante actualizado", payload: updated }
}


