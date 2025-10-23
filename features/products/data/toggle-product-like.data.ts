"use server"

import { prisma } from "@/utils/prisma"

export async function toggleProductLikeData(userId: number, productId: number) {
    // Verificar si ya existe el like
    const existingLike = await prisma.$queryRaw`
            SELECT * FROM product_likes 
            WHERE user_id = ${userId} AND product_id = ${productId}
        `

    let isLiked: boolean

    if (Array.isArray(existingLike) && existingLike.length > 0) {
        // Si existe, eliminarlo (unlike)
        await prisma.$executeRaw`
                DELETE FROM product_likes 
                WHERE user_id = ${userId} AND product_id = ${productId}
            `
        isLiked = false
    } else {
        // Si no existe, crearlo (like)
        await prisma.$executeRaw`
                INSERT INTO product_likes (user_id, product_id, created_at) 
                VALUES (${userId}, ${productId}, NOW())
            `
        isLiked = true

        const product = await prisma.product.findUnique({
            where: {
                id: productId
            },
            select: {
                store: true
            }
        })

        await prisma.socialActivity.create({
            data: {
                user_id: userId,
                activity_type: "PRODUCT_LIKE",
                entity_type: "PRODUCT",
                entity_id: productId,
                title: `Product ${productId} liked`,
                store_id: product?.store.id,
                product_id: productId
            }
        })
    }

    // Obtener el conteo actualizado
    const result = await prisma.$queryRaw`
            SELECT COUNT(*) as count FROM product_likes 
            WHERE product_id = ${productId}
        ` as { count: number }[]

    const count = Number(result[0]?.count || 0)


    return {
        error: false,
        message: isLiked ? "Like added successfully" : "Like removed successfully",
        payload: { isLiked, count }
    }
} 