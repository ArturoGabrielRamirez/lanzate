"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"

export async function selectOrderById(orderId: number) {
    return actionWrapper(async () => {

        const client = new PrismaClient()

        const order = await client.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true,
                        avatar: true
                    }
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
                created_by_employee: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                first_name: true,
                                last_name: true
                            }
                        }
                    }
                },
                updated_by_employee: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                first_name: true,
                                last_name: true
                            }
                        }
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
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