"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { Order, Product, OrderItem, OrderTracking, OrderPayment } from "@prisma/client"

type SelectOrderByIdResponse = {
    message: string
    payload: Order & { items: (OrderItem & { product: Product })[] } & { tracking: OrderTracking | null } & { payment: OrderPayment } | null
    error: boolean
}

export async function selectOrderByIdData(orderId: number): Promise<SelectOrderByIdResponse> {
    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true,
                        avatar: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                image: true,
                                categories: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                branch: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        phone: true,
                        email: true
                    }
                },
                payment: true,
                processed_by: true,
                store: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                messages: true,
                tracking: true
            }
        })

        if (!order) {
            throw new Error("Order not found")
        }

        return {
            message: "Order details fetched successfully",
            payload: order,
            error: false
        }

    })
} 