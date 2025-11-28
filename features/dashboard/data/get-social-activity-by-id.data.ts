"use server"

import { prisma } from "@/utils/prisma"

export async function getSocialActivityByIdData(activityId: number) {
    const socialActivity = await prisma.socialActivity.findUnique({
        where: {
            id: activityId
        },
        include: {
            user: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    avatar: true,
                    email: true,
                    username: true
                }
            },
            store: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            },
            order: true,
            product: true,
        }
    })

    if (!socialActivity) {
        throw new Error("Actividad no encontrada")
    }

    return {
        message: "Actividad social obtenida con éxito",
        payload: socialActivity,
        hasError: false
    }
} 