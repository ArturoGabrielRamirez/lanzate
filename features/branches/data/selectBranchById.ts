"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function selectBranchById(id: number) {
    return actionWrapper(async () => {
        /* const prisma = new PrismaClient() */

        const branch = await prisma.branch.findUnique({
            where: {
                id: id
            },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                stock: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                image: true
                            }
                        }
                    }
                },
                orders: {
                    select: {
                        id: true,
                        total_price: true,
                        status: true,
                        created_at: true
                    },
                    orderBy: {
                        created_at: 'desc'
                    },
                    take: 10
                }
            }
        })

        if (!branch) throw new Error("Branch not found")

        return {
            payload: branch,
            error: false,
            message: "Branch details fetched successfully"
        }
    })
} 