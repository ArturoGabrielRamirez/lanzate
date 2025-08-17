"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function getSocialActivityById(activityId: number) {
    return actionWrapper(async () => {
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
            throw new Error("Social activity not found")
        }

        return {
            message: "Social activity fetched successfully",
            payload: socialActivity,
            error: false
        }
    })
} 