"use server"

import { PrismaClient } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"

export async function getLogDetailsById(id: number) {
    return actionWrapper(async () => {

        const prisma = new PrismaClient()

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
                error: true,
                message: "Log not found",
                payload: null
            }
        }

        return {
            error: false,
            message: "Log details retrieved successfully",
            payload: log
        }

    })
} 