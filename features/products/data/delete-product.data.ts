"use server"

import { prisma } from "@/utils/prisma"


export async function deleteProductData(productId: number) {
    const result = await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: { id: productId },
            include: {
                variants: {
                    select: { id: true }
                },
            }
        })

        if (!product) throw new Error("Product not found")

        const variantIds = product.variants.map(v => v.id)

        if (variantIds.length > 0) {
            // Soft delete variants by setting is_deleted to true
            await tx.productVariant.updateMany({
                where: { id: { in: variantIds } },
                data: { is_deleted: true }
            })
        }

        // Soft delete product by setting is_deleted to true
        await tx.product.update({
            where: { id: productId },
            data: { is_deleted: true }
        })

        return product
    })

    return {
        message: "Product soft deleted successfully from db",
        payload: result,
        hasError: false
    }
} 
