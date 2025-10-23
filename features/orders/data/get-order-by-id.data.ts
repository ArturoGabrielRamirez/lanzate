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

export async function getOrderByIdData(orderId: number, userId: number): Promise<{
    payload: OrderWithDetails | null
    error: boolean
    message: string
}> {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                customer_id: userId
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                store: true,
                branch: true,
                tracking: true,
                payment: true
            }
        })

        if (!order) {
            return {
                payload: null,
                error: true,
                message: "Order not found"
            }
        }

        return {
            payload: order,
            error: false,
            message: "Order fetched successfully"
        }
    } catch (error) {
        return {
            payload: null,
            error: true,
            message: error instanceof Error ? error.message : "Failed to fetch order"
        }
    }
} 