"use server"


import { revalidatePath } from "next/cache"

import { UpdateVariantDimensionsPayload } from "@/features/products/types"
import { validateWeightUnit } from "@/features/products/utils"
import { validateLengthUnit } from "@/features/products/utils"
import { prisma } from "@/utils/prisma"

 

export async function updateVariantDimensionsData(variantId: number, data: UpdateVariantDimensionsPayload) {
    const variant = await prisma.productVariant.update({
        where: { id: variantId },
        data: {
            weight: data.weight,
            weight_unit: validateWeightUnit(data.weight_unit),
            height: data.height,
            height_unit: validateLengthUnit(data.height_unit),
            width: data.width,
            width_unit: validateLengthUnit(data.width_unit),
            depth: data.depth,
            depth_unit: validateLengthUnit(data.depth_unit),
            diameter: data.diameter,
            diameter_unit: validateLengthUnit(data.diameter_unit)
        }
    })

    const ref = await prisma.productVariant.findUnique({
        where: { id: variantId },
        select: { product: { select: { id: true, store: { select: { slug: true } } } } }
    })
    if (ref?.product?.store?.slug && ref.product.id) {
        revalidatePath(`/stores/${ref.product.store.slug}/products/${ref.product.id}/${variantId}`, "page")
    }

    return { hasError: false, message: "Dimensiones actualizadas correctamente", payload: variant }
}
