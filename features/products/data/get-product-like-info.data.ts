"use server"

import { prisma } from "@/utils/prisma"

export async function getProductLikeInfoData(userId: number | null, productId: number) {
    // Obtener el conteo total de likes
    const countResult = await prisma.$queryRaw`
            SELECT COUNT(*) as count FROM product_likes 
            WHERE product_id = ${productId}
        ` as { count: number }[]

    const count = Number(countResult[0]?.count || 0)

    // Si no hay usuario, solo retornar el conteo
    if (!userId) {
        return {
            error: false,
            message: "Información de likes del producto obtenida correctamente",
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
        hasError: false,
        message: "Información de likes del producto obtenida correctamente",
        payload: { isLiked, count }
    }
} 