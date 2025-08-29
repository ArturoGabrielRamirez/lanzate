"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function deleteProductVariant(variantId: number) {
    return actionWrapper(async () => {
        const result = await prisma.$transaction(async (tx) => {
            const variant = await tx.productVariant.findUnique({
                where: { id: variantId },
                include: { product: true }
            })
            if (!variant) throw new Error("Variant not found")

            // Soft delete variant by setting is_deleted to true
            await tx.productVariant.update({ 
                where: { id: variantId },
                data: { is_deleted: true }
            })

            // derive product stock after deletion (only from non-deleted variants)
            const total = await tx.productVariantStock.aggregate({
                _sum: { quantity: true },
                where: { 
                    variant: { 
                        product_id: variant.product_id,
                        is_deleted: false
                    } 
                }
            })
            await tx.product.update({ where: { id: variant.product_id }, data: { stock: total._sum.quantity ?? 0 } })

            return { deletedVariantId: variantId, productId: variant.product_id }
        })

        return { error: false, message: "Variant soft deleted", payload: result }
    })
}


