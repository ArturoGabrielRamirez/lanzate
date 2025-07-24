"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"
import { TopProductData } from "../types"

export async function getTopProducts(storeId: number, limit: number = 5) {
    try {
        const client = new PrismaClient()

        // Get order items with product info for this store
        const orderItems = await client.orderItem.findMany({
            where: {
                order: {
                    store_id: storeId,
                    is_paid: true
                }
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        })

        // Group by product and calculate totals
        const productSales = new Map<number, { name: string; totalSold: number; revenue: number; image?: string }>()

        orderItems.forEach(item => {
            const productId = item.product_id
            const existing = productSales.get(productId) || { 
                name: item.product.name, 
                totalSold: 0, 
                revenue: 0,
                image: item.product.image || undefined
            }

            productSales.set(productId, {
                name: existing.name,
                totalSold: existing.totalSold + item.quantity,
                revenue: existing.revenue + (item.price * item.quantity),
                image: existing.image
            })
        })

        // Convert to array and sort by total sold
        const topProducts: TopProductData[] = Array.from(productSales.entries())
            .map(([productId, data]) => ({
                productId,
                productName: data.name,
                totalSold: data.totalSold,
                revenue: data.revenue,
                image: data.image
            }))
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, limit)

        return {
            message: "Top products fetched successfully",
            payload: topProducts,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error fetching top products", error, [])
    }
} 