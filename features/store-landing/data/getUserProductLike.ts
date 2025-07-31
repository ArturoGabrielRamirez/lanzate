"use server"

import { PrismaClient } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"

export async function getUserProductLike(userId: number, productId: number) {
    return actionWrapper(async () => {
        
        const prisma = new PrismaClient()

        const like = await prisma.$queryRaw`
            SELECT * FROM product_likes 
            WHERE user_id = ${userId} AND product_id = ${productId}
        `

        const isLiked = Array.isArray(like) && like.length > 0

        return {
            error: false,
            message: "Like status checked successfully",
            payload: { isLiked }
        }
    })
} 