"use server"

import { PrismaClient } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"

export async function getProductLikeInfo(userId: number | null, productId: number) {
    return actionWrapper(async () => {
        
        const prisma = new PrismaClient()

        // Obtener el conteo total de likes
        const countResult = await prisma.$queryRaw`
            SELECT COUNT(*) as count FROM product_likes 
            WHERE product_id = ${productId}
        ` as any[]

        const count = Number(countResult[0]?.count || 0)

        // Si no hay usuario, solo retornar el conteo
        if (!userId) {
            return {
                error: false,
                message: "Product like info retrieved successfully",
                payload: { isLiked: false, count }
            }
        }

        // Verificar si el usuario ha dado like
        const userLike = await prisma.$queryRaw`
            SELECT * FROM product_likes 
            WHERE user_id = ${userId} AND product_id = ${productId}
        `

        const isLiked = Array.isArray(userLike) && userLike.length > 0

        return {
            error: false,
            message: "Product like info retrieved successfully",
            payload: { isLiked, count }
        }
    })
} 