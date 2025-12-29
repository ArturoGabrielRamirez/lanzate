"use server"

import { prisma } from "@/utils/prisma"

export async function insertProductCommentData(userId: number, productId: number, content: string) {
    const comment = await prisma.product_comments.create({
        data: {
            user_id: userId,
            product_id: productId,
            content: content,
            is_active: true,
            updated_at: new Date()
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
        }
    })

    const product = await prisma.product.findUnique({
        where: {
            id: productId
        },
        select: {
            store: true,
            name: true
        }
    })

    await prisma.socialActivity.create({
        data: {
            user_id: userId,
            activity_type: "PRODUCT_COMMENT",
            entity_type: "PRODUCT",
            entity_id: productId,
            title: `Producto ${product?.name} comentado`,
            store_id: product?.store.id,
            product_id: productId
        }
    })

    return {
        hasError: false,
        message: "Comentario agregado correctamente",
        payload: comment
    }
} 