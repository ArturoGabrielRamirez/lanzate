"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function selectUserStoreActivities(userId: number) {
    return actionWrapper(async () => {

        // Get all stores owned by the user
        const userStores = await prisma.store.findMany({
            where: {
                user_id: userId
            },
            select: {
                id: true
            }
        })

        // Get all stores where user is an employee
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
                        avatar: true,
                        email: true,
                        username: true
                    }
                },
                products: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        store: {
                            select: {
                                id: true,
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
                                id: true,
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

        // Get orders from stores where user is owner or employee
        const orders = await prisma.order.findMany({
            where: {
                store_id: {
                    in: storeIds
                }
            },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                customer: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        avatar: true
                    }
                },
                processed_by: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        avatar: true
                    }
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true
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
                                id: true,
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
                                id: true,
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
                orders,
                contractAssignmentsAsEmployee,
                contractAssignmentsAsOwner
            },
            error: false
        }

    })
} 
