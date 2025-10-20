"use server"

import { prisma } from "@/utils/prisma"
import { Order, OrderItem, Product, Store, Branch } from "@prisma/client"

type OrderWithDetails = Order & {
    items: (OrderItem & {
        product: Product
    })[]
    store: Store
    branch: Branch
}

export async function getUserOrders(userId: number): Promise<{
    payload: OrderWithDetails[] | null
    error: boolean
    message: string
}> {
    try {
        const orders = await prisma.order.findMany({
            where: {
                customer_id: userId
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                store: true,
                branch: true
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        return {
            payload: orders,
            error: false,
            message: "Orders fetched successfully"
        }
    } catch (error) {
        return {
            payload: null,
            error: true,
            message: error instanceof Error ? error.message : "Failed to fetch orders"
        }
    }
} 