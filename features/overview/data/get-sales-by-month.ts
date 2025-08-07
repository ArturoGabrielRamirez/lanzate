"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { SalesByMonthData } from "../types"
import { prisma } from "@/utils/prisma"

export async function getSalesByMonth(storeId: number) {
    return actionWrapper(async () => {
        /* const client = new PrismaClient() */

        // Get orders from the last 6 months
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const orders = await prisma.order.findMany({
            where: {
                store_id: storeId,
                is_paid: true,
                created_at: {
                    gte: sixMonthsAgo
                }
            },
            select: {
                total_price: true,
                created_at: true,
                total_quantity: true
            }
        })

        // Group orders by month
        const salesByMonth = new Map<string, { sales: number; orders: number; revenue: number }>()

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            salesByMonth.set(monthKey, { sales: 0, orders: 0, revenue: 0 })
        }

        // Aggregate data
        orders.forEach(order => {
            const monthKey = order.created_at.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            const existing = salesByMonth.get(monthKey) || { sales: 0, orders: 0, revenue: 0 }

            salesByMonth.set(monthKey, {
                sales: existing.sales + order.total_quantity,
                orders: existing.orders + 1,
                revenue: existing.revenue + order.total_price
            })
        })

        // Convert to array
        const result: SalesByMonthData[] = Array.from(salesByMonth.entries()).map(([month, data]) => ({
            month,
            sales: data.sales,
            orders: data.orders,
            revenue: data.revenue
        }))

        return {
            message: "Sales by month fetched successfully",
            payload: result,
            error: false
        }

    })
} 