"use server"

import { revalidatePath } from "next/cache"

import { UpdateVariantSizesPayload } from "@/features/products/types"
import { prisma } from "@/utils/prisma"

export async function updateVariantSizesData(variantId: number, data: UpdateVariantSizesPayload) {
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

    return { hasError: false, message: "Variant sizes updated successfully", payload: variant }
}
