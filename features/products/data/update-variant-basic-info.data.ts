"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/utils/prisma"

type UpdateVariantBasicInfoPayload = {
    name: string | null
    sku: string | null
    barcode: string | null
    description: string | null
}

export async function updateVariantBasicInfoData(variantId: number, data: UpdateVariantBasicInfoPayload) {
    const variant = await prisma.productVariant.update({
        where: { id: variantId },
        data: {
            name: data.name,
            sku: data.sku,
            barcode: data.barcode,
            description: data.description
        }
    })

    const ref = await prisma.productVariant.findUnique({
        where: { id: variantId },
        select: { product: { select: { id: true, store: { select: { slug: true } } } } }
    })
    if (ref?.product?.store?.slug && ref.product.id) {
        revalidatePath(`/stores/${ref.product.store.slug}/products/${ref.product.id}/${variantId}`, "page")
    }

    return { hasError: false, message: "Variant updated successfully", payload: variant }
}
