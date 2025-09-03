"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"
import { revalidatePath } from "next/cache"

type UpdateVariantSizesPayload = {
    size: string | null
    measure: string | null
}

export async function updateVariantSizes(variantId: number, data: UpdateVariantSizesPayload) {
    return actionWrapper(async () => {
        const variant = await prisma.productVariant.update({
            where: { id: variantId },
            data: {
                size: data.size,
                measure: data.measure
            }
        })

        const ref = await prisma.productVariant.findUnique({
            where: { id: variantId },
            select: { product: { select: { id: true, store: { select: { slug: true } } } } }
        })
        if (ref?.product?.store?.slug && ref.product.id) {
            revalidatePath(`/stores/${ref.product.store.slug}/products/${ref.product.id}/${variantId}`, "page")
        }

        return { error: false, message: "Variant sizes updated successfully", payload: variant }
    })
}
