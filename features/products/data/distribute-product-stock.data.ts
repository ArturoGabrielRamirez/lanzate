"use server"

import { DistributeStockData } from "@/features/products/types"
import { prisma } from "@/utils/prisma"

export async function distributeProductStockData(data: DistributeStockData) {
    try {
        const { productId, distributions } = data

        // Get current product and its stock distribution
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                stock_entries: {
                    include: {
                        branch: true
                    }
                }
            }
        })

        if (!product) {
            return {
                error: true,
                message: "Product not found",
                payload: null
            }
        }

        // Calculate total current stock across all branches
        const totalCurrentStock = product.stock_entries.reduce((sum, entry) => sum + entry.quantity, 0)
        
        // Calculate total requested distribution
        const totalRequestedDistribution = distributions.reduce((sum, dist) => sum + dist.quantity, 0)

        // Validate that we're not creating stock out of thin air
        if (totalRequestedDistribution > totalCurrentStock) {
            return {
                error: true,
                message: "Cannot distribute more stock than currently available across all branches",
                payload: null
            }
        }

        // Update stock in transaction
        await prisma.$transaction(async (tx) => {
            // Update branch stocks - this will redistribute existing stock
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
                            quantity: distribution.quantity
                        },
                        create: {
                            product_id: productId,
                            branch_id: distribution.branchId,
                            quantity: distribution.quantity
                        }
                    })
                }
            }

            // Clear stock from branches that are not in the distribution
            const branchIdsInDistribution = distributions.map(d => d.branchId)
            await tx.productStock.deleteMany({
                where: {
                    product_id: productId,
                    branch_id: {
                        notIn: branchIdsInDistribution
                    }
                }
            })
        })

        return {
            error: false,
            message: "Stock redistributed successfully",
            payload: null
        }
    } catch (error) {
        console.error("Error redistributing stock:", error)
        return {
            error: true,
            message: "Failed to redistribute stock",
            payload: null
        }
    }
}