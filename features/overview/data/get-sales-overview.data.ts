"use server"

import { SalesOverviewData } from "@/features/overview/types/types"
import { prisma } from "@/utils/prisma"

export async function getSalesOverviewData(storeId: number) {
    // Get all orders for this store
    const orders = await prisma.order.findMany({
        where: {
            store_id: storeId,
            is_paid: true
        },
        select: {
            total_price: true,
            created_at: true
        }
    })

    const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const salesOverview: SalesOverviewData = {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        period: "all-time"
    }

    return {
        message: "Resumen de ventas obtenido correctamente",
        payload: salesOverview,
        error: false
    }

} 