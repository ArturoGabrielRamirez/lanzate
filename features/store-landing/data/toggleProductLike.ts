"use server"

import { PrismaClient } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"

export async function toggleProductLike(userId: number, productId: number) {
    return actionWrapper(async () => {
        
        const prisma = new PrismaClient()

        // Verificar si ya existe el like
        const existingLike = await prisma.$queryRaw`
            SELECT * FROM product_likes 
            WHERE user_id = ${userId} AND product_id = ${productId}
        `

        if (Array.isArray(existingLike) && existingLike.length > 0) {
            // Si existe, eliminarlo (unlike)
            await prisma.$executeRaw`
                DELETE FROM product_likes 
                WHERE user_id = ${userId} AND product_id = ${productId}
            `

            return {
                error: false,
                message: "Like removed successfully",
                payload: { isLiked: false }
            }
        } else {
            // Si no existe, crearlo (like)
            await prisma.$executeRaw`
                INSERT INTO product_likes (user_id, product_id, created_at) 
                VALUES (${userId}, ${productId}, NOW())
            `

            return {
                error: false,
                message: "Like added successfully",
                payload: { isLiked: true }
            }
        }
    })
} 