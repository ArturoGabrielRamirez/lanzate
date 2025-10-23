"use server"


import { revalidatePath } from "next/cache"

import { UpdateVariantDimensionsPayload } from "@/features/products/types"
import { prisma } from "@/utils/prisma"

import type { WeightUnit, LengthUnit } from "@prisma/client"

const validateWeightUnit = (unit: string | null | undefined): WeightUnit | null => {
    if (!unit) return null
    if (["MG", "G", "KG", "OZ", "LB"].includes(unit)) {
        return unit as WeightUnit
    }
    return "KG"
}

const validateLengthUnit = (unit: string | null | undefined): LengthUnit | null => {
    if (!unit) return null
    if (["MM", "CM", "M", "IN", "FT"].includes(unit)) {
        return unit as LengthUnit
    }
    return "CM"
}

 

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
