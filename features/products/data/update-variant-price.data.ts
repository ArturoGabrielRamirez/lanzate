"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/utils/prisma"

type UpdateVariantPricePayload = {
    price: number | null
}

export async function updateVariantPrice(variantId: number, data: UpdateVariantPricePayload) {
    const variant = await prisma.productVariant.update({
        where: { id: variantId },
        data: {
            price: data.price
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
        message: data.price ? "Precio actualizado correctamente" : "Se restableció el precio base del producto",
        payload: variant
    }
}
