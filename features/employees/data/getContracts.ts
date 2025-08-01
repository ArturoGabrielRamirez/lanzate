"use server"

import { PrismaClient } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"

export async function getContracts(storeId: number) {
    return actionWrapper(async () => {

        const client = new PrismaClient()

        const contracts = await client.contract.findMany({
            where: {
                store_id: storeId
            },
            include: {
                store: true,
                created_by_user: true,
                assignments: {
                    include: {
                        employee: {
                            include: {
                                user: true
                            }
                        },
                        assigned_by_user: true,
                        responses: {
                            include: {
                                employee: {
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    include: {
                        employee: {
                            include: {
                                user: true
                            }
                        },
                        assignment: {
                            include: {
                                employee: {
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        await client.$disconnect()

        return {
            error: false,
            message: "Contracts retrieved successfully",
            payload: contracts
        }

    })
} 