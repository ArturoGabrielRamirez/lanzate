"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper, formatErrorResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function selectUserStoreActivities(userId: number) {
    return actionWrapper(async () => {
        /* const prisma = new PrismaClient() */

        // Get all stores owned by the user
        const userStores = await prisma.store.findMany({
            where: {
                user_id: userId
            },
            select: {
                id: true
            }
        })

        const storeIds = userStores.map(store => store.id)

        if (storeIds.length === 0) {
            return {
                message: "No stores found for user",
                payload: { likes: [], comments: [] },
                error: false
            }
        }

        // Get all likes for products in user's stores
        const likes = await prisma.product_likes.findMany({
            where: {
                products: {
                    store_id: {
                        in: storeIds
                    }
                }
            },
            include: {
                users: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        avatar: true
                    }
                },
                products: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        store: {
                            select: {
                                name: true,
                                slug: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            },
            take: 50
        })

        // Get all comments for products in user's stores  
        const comments = await prisma.product_comments.findMany({
            where: {
                products: {
                    store_id: {
                        in: storeIds
                    }
                },
                is_active: true
            },
            include: {
                users: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        avatar: true
                    }
                },
                products: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        store: {
                            select: {
                                name: true,
                                slug: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            },
            take: 50
        })

        return {
            message: "User store activities fetched successfully",
            payload: { likes, comments },
            error: false
        }

    })
} 
