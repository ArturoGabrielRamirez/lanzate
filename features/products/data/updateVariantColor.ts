"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { revalidatePath } from "next/cache"

export async function updateVariantColor(variantId: number, colorId: number | null) {
    return actionWrapper(async () => {
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

        return { error: false, message: "Color de variante actualizado", payload: updated }
    })
}


