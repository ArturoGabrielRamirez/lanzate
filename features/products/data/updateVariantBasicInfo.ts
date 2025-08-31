"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"
import { revalidatePath } from "next/cache"

type UpdateVariantBasicInfoPayload = {
    name: string | null
    sku: string | null
    barcode: string | null
    description: string | null
}

export async function updateVariantBasicInfo(variantId: number, data: UpdateVariantBasicInfoPayload) {
    return actionWrapper(async () => {
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

        return { error: false, message: "Variant updated successfully", payload: variant }
    })
}
