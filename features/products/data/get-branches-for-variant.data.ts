"use server"

import { VariantBranch } from "@/features/products/types"
import { prisma } from "@/utils/prisma"

export async function getBranchesForVariant(variantId: number) {
    const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        select: { product: { select: { store_id: true } } }
    })

    if (!variant?.product?.store_id) {
        throw new Error("No se pudo determinar la tienda de la variante")
    }

    const branches = await prisma.branch.findMany({
        where: { store_id: variant.product.store_id },
        select: { id: true, name: true }
    })

    return {
        hasError: false,
        message: "Sucursales obtenidas correctamente",
        payload: branches as VariantBranch[]
    }
}


