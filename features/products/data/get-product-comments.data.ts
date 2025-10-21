"use server"

import { prisma } from "@/utils/prisma"

export async function getProductCommentsData(productId: number) {
    const comments = await prisma.product_comments.findMany({
        where: {
            product_id: productId,
            is_active: true
        },
        include: {
            users: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true
                }
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    })

    return {
        hasError: false,
        message: "Comments fetched successfully",
        payload: comments
    }
} 