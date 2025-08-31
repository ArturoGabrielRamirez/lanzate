"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export type VariantStockUpdate = { branch_id: number; quantity: number }

export async function updateVariantStocks(variantId: number, updates: VariantStockUpdate[]) {
    return actionWrapper(async () => {
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

        return {
            error: false,
            message: "Stock actualizado correctamente",
            payload: refreshed
        }
    })
}


