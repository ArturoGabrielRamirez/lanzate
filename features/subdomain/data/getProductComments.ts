"use server"

import { PrismaClient } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"

export async function getProductComments(productId: number) {
    return actionWrapper(async () => {
        
        const prisma = new PrismaClient()

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
            error: false,
            message: "Comments fetched successfully",
            payload: comments
        }
    })
} 