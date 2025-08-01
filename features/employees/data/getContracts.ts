"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function getContracts(storeId: number) {
    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        const contracts = await prisma.contract.findMany({
            where: {
                store_id: storeId
            },
            include: {
                store: true,
                created_by_user: true,
                assigned_employee: {
                    include: {
                        user: true
                    }
                },
                responses: {
                    include: {
                        employee: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        return {
            error: false,
            message: "Contracts retrieved successfully",
            payload: contracts
        }

    })
} 