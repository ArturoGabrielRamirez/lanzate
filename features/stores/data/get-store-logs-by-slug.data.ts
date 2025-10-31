"use server"

import { prisma } from "@/utils/prisma"

export async function getStoreLogsBySlugData(slug: string) {

    const store = await prisma.store.findUnique({
        where: { slug }
    })

    if (!store) {
        return {
            hasError: true,
            message: "Store not found",
            payload: null
        }
    }

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
        hasError: false,
        message: "Store logs retrieved successfully",
        payload: logs
    }

} 