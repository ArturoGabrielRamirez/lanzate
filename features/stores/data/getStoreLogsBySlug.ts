"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"

export async function getStoreLogsBySlug(slug: string) {
    return actionWrapper(async () => {

        const prisma = new PrismaClient()

        // First get the store to verify it exists
        const store = await prisma.store.findUnique({
            where: { slug }
        })

        if (!store) {
            return {
                error: true,
                message: "Store not found",
                payload: null
            }
        }

        // Get action logs related to this store and its entities
        const logs = await prisma.actionLog.findMany({
            where: {
                OR: [
                    // Direct store actions
                    {
                        entity_type: "STORE",
                        entity_id: store.id
                    },
                    // Actions on store's products
                    {
                        entity_type: "PRODUCT",
                        user: {
                            Store: {
                                some: {
                                    id: store.id
                                }
                            }
                        }
                    },
                    // Actions on store's branches
                    {
                        entity_type: "BRANCH",
                        user: {
                            Store: {
                                some: {
                                    id: store.id
                                }
                            }
                        }
                    },
                    // Actions on store's orders
                    {
                        entity_type: "ORDER",
                        user: {
                            Store: {
                                some: {
                                    id: store.id
                                }
                            }
                        }
                    },
                    // Actions by store employees
                    {
                        employee: {
                            store_id: store.id
                        }
                    }
                ]
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true
                    }
                },
                employee: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                first_name: true,
                                last_name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        })

        return {
            error: false,
            message: "Store logs retrieved successfully",
            payload: logs
        }

    })
} 