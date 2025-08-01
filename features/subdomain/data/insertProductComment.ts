"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function insertProductComment(userId: number, productId: number, content: string) {
    return actionWrapper(async () => {

        /* const prisma = new PrismaClient() */

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

        return {
            error: false,
            message: "Comment added successfully",
            payload: comment
        }
    })
} 