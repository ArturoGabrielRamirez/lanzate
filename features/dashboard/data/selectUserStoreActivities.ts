"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { SocialActivityType } from "@prisma/client"

export async function selectUserStoreActivities(userId: number, type: string, page: number) {
    return actionWrapper(async () => {
        const userStores = await prisma.store.findMany({
            where: {
                user_id: userId
            },
            select: {
                id: true
            }
        })

        const userEmployeeStores = await prisma.employee.findMany({
            where: {
                user_id: userId,
                is_active: true
            },
            select: {
                store_id: true
            }
        })

        const storeIds = [
            ...userStores.map(store => store.id),
            ...userEmployeeStores.map(emp => emp.store_id)
        ]

        let activityType: SocialActivityType | "" = ""
        if (type === "likes") {
            activityType = "PRODUCT_LIKE"
        } else if (type === "comments") {
            activityType = "PRODUCT_COMMENT"
        } else if (type === "orders") {
            activityType = "ORDER_CREATED"
        }

        // Get social activities for stores where user is owner or employee
        const socialActivities = await prisma.socialActivity.findMany({
            where: {
                OR: [
                    {
                        store_id: {
                            in: storeIds
                        }
                    }
                ],
                ...(activityType && { activity_type: activityType })
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
                product: {
                    include: {
                        store: true
                    }
                },
                order: {
                    include: {
                        tracking: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'

            },
            take: 5,
            skip: (page - 1) * 5
        })

        return {
            message: "User store activities fetched successfully",
            payload: socialActivities,
            error: false
        }
    })
}