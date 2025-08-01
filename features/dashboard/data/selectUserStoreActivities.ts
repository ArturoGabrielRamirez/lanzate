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

        // Get contract assignments where the user is the employee (assigned to them)
        const contractAssignmentsAsEmployee = await prisma.contractAssignment.findMany({
            where: {
                employee: {
                    user_id: userId
                }
            },
            include: {
                contract: {
                    include: {
                        store: {
                            select: {
                                name: true,
                                slug: true
                            }
                        },
                        created_by_user: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                avatar: true
                            }
                        }
                    }
                },
                employee: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                avatar: true
                            }
                        }
                    }
                },
                assigned_by_user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                assigned_at: 'desc'
            },
            take: 50
        })

        // Get contract assignments where the user is the store owner (they assigned contracts to others)
        const contractAssignmentsAsOwner = await prisma.contractAssignment.findMany({
            where: {
                contract: {
                    store_id: {
                        in: storeIds
                    }
                }
            },
            include: {
                contract: {
                    include: {
                        store: {
                            select: {
                                name: true,
                                slug: true
                            }
                        },
                        created_by_user: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                avatar: true
                            }
                        }
                    }
                },
                employee: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                avatar: true
                            }
                        }
                    }
                },
                assigned_by_user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                assigned_at: 'desc'
            },
            take: 50
        })

        return {
            message: "User store activities fetched successfully",
            payload: { 
                likes, 
                comments, 
                contractAssignmentsAsEmployee,
                contractAssignmentsAsOwner
            },
            error: false
        }

    })
} 
