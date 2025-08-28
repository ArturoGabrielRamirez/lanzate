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

            await tx.productVariantStock.deleteMany({ where: { variant_id: variantId } })
            await tx.productMedia.deleteMany({ where: { product_variant_id: variantId } })
            await tx.productVariant.delete({ where: { id: variantId } })

            // derive product stock after deletion
            const total = await tx.productVariantStock.aggregate({
                _sum: { quantity: true },
                where: { variant: { product_id: variant.product_id } }
            })
            await tx.product.update({ where: { id: variant.product_id }, data: { stock: total._sum.quantity ?? 0 } })

            return { deletedVariantId: variantId, productId: variant.product_id }
        })

        return { error: false, message: "Variant deleted", payload: result }
    })
}


