"use server"

import { ProcessedShippingMethod } from "@/features/stores/types"
import { prisma } from "@/utils/prisma"

export async function updateStoreShippingData(slug: string, methods: ProcessedShippingMethod[]) {
    
    const store = await prisma.store.findUnique({
        where: { slug },
        select: { id: true }
    })

    if (!store) {
        throw new Error("Tienda no encontrada")
    }

    const mainBranch = await prisma.branch.findFirst({
        where: {
            store_id: store.id,
            is_main: true
        }
    })

    if (!mainBranch) {
        throw new Error("Sucursal principal no encontrada")
    }

    return await prisma.$transaction(async (tx) => {
        // 1. Delete existing shipping methods
        await tx.branchShippingMethod.deleteMany({
            where: {
                branch_id: mainBranch.id
            }
        })

        // 2. Create new shipping methods
        // Filter out methods that might not be active if needed, but usually we save what we have.
        // We map ProcessedShippingMethod to DB fields.
        // DB doesn't have eta_minutes, so we ignore it.
        if (methods.length > 0) {
            await tx.branchShippingMethod.createMany({
                data: methods.map(m => ({
                    branch_id: mainBranch.id,
                    provider: m.provider,
                    min_order_amount: m.min_order_amount,
                    free_shipping_min: m.free_shipping_min,
                    delivery_price: m.delivery_price,
                    active: m.active
                }))
            })
        }

        return { success: true }
    })
}

