"use server"

import { PrismaClient } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"

export async function getProductLikesCount(productId: number) {
    return actionWrapper(async () => {
        
        const prisma = new PrismaClient()

        const result = await prisma.$queryRaw`
            SELECT COUNT(*) as count FROM product_likes 
            WHERE product_id = ${productId}
        ` as any[]

        const count = Number(result[0]?.count || 0)

        return {
            error: false,
            message: "Likes count retrieved successfully",
            payload: { count }
        }
    })
} 