"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

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

        return { error: false, message: "Variant sizes updated successfully", payload: variant }
    })
}
