"use server"


import { ResponseType } from "@/features/layout/types"
import { prisma } from "@/utils/prisma"
import { revalidatePath } from "next/cache"

type DistributeStockData = {
    productId: number
    distributions: {
        branchId: number
        quantity: number
    }[]
}

export async function distributeProductStock(data: DistributeStockData): Promise<ResponseType<any>> {
    try {
        const { productId, distributions } = data

        // Get current product stock
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { stock: true, store_id: true }
        })

        if (!product) {
            return {
                error: true,
                message: "Product not found",
                payload: null
            }
        }

        // Calculate total distribution
        const totalDistribution = distributions.reduce((sum, dist) => sum + dist.quantity, 0)

        if (totalDistribution > product.stock) {
            return {
                error: true,
                message: "Cannot distribute more stock than available",
                payload: null
            }
        }

        // Update stock in transaction
        await prisma.$transaction(async (tx) => {
            // Update product stock
            await tx.product.update({
                where: { id: productId },
                data: { stock: product.stock - totalDistribution }
            })

            // Update branch stocks
            for (const distribution of distributions) {
                if (distribution.quantity > 0) {
                    await tx.productStock.upsert({
                        where: {
                            product_id_branch_id: {
                                product_id: productId,
                                branch_id: distribution.branchId
                            }
                        },
                        update: {
                            quantity: {
                                increment: distribution.quantity
                            }
                        },
                        create: {
                            product_id: productId,
                            branch_id: distribution.branchId,
                            quantity: distribution.quantity
                        }
                    })
                }
            }
        })

        revalidatePath("/stores/[slug]/products", "page")

        return {
            error: false,
            message: "Stock distributed successfully",
            payload: null
        }
    } catch (error) {
        console.error("Error distributing stock:", error)
        return {
            error: true,
            message: "Failed to distribute stock",
            payload: null
        }
    }
}