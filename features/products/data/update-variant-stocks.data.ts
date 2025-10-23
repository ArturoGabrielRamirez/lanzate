"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/utils/prisma"

export type VariantStockUpdate = { branch_id: number; quantity: number }

export async function updateVariantStocksData(variantId: number, updates: VariantStockUpdate[]) {
    // Upsert per-branch stock for the variant
    await prisma.$transaction(async (tx) => {
        for (const { branch_id, quantity } of updates) {
            await tx.productVariantStock.upsert({
                where: { variant_id_branch_id: { variant_id: variantId, branch_id } },
                update: { quantity },
                create: { variant_id: variantId, branch_id, quantity }
            })
        }
    })

    const refreshed = await prisma.productVariant.findUnique({
        where: { id: variantId },
        include: { stocks: true }
    })

    const ref = await prisma.productVariant.findUnique({
        where: { id: variantId },
        select: { product: { select: { id: true, store: { select: { slug: true } } } } }
    })
    if (ref?.product?.store?.slug && ref.product.id) {
        revalidatePath(`/stores/${ref.product.store.slug}/products/${ref.product.id}/${variantId}`, "page")
    }

    return {
        hasError: false,
        message: "Stock actualizado correctamente",
        payload: refreshed
    }
}


