"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

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

        return { error: false, message: "Variant updated successfully", payload: variant }
    })
}
