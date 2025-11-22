"use server"

import { formatSuccessResponse } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function getContractsData(storeId: number) {


    const contracts = await prisma.contract.findMany({
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

    return formatSuccessResponse("Contratos recuperados exitosamente", contracts)

} 