"use server"

import { prisma } from "@/utils/prisma"

export async function getLogDetailsByIdData(id: number) {
    const log = await prisma.actionLog.findUnique({
        where: { id },
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
        }
    })

    if (!log) {
        return {
            hasError: true,
            message: "Log not found",
            payload: null
        }
    }

    return {
        hasError: false,
        message: "Log details retrieved successfully",
        payload: log
    }

} 