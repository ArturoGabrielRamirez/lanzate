"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"


export async function deleteProduct(productId: number) {
    return actionWrapper(async () => {
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
                // Delete stocks for variants
                await tx.productVariantStock.deleteMany({ where: { variant_id: { in: variantIds } } })
                // Delete media linked to variants
                await tx.productMedia.deleteMany({ where: { product_variant_id: { in: variantIds } } })
                // Delete variants
                await tx.productVariant.deleteMany({ where: { id: { in: variantIds } } })
            }

            // Delete product media
            await tx.productMedia.deleteMany({ where: { product_id: productId } })

            // Finally delete product
            await tx.product.delete({ where: { id: productId } })

            return product
        })

        return {
            message: "Product deleted successfully from db",
            payload: result,
            error: false
        }
    })
} 
