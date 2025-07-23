"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"

export async function selectUsersByFilter(filter: string) {
    return actionWrapper(async () => {
        const client = new PrismaClient()
        const users = await client.user.findMany({
            where: {
                OR: [
                    {
                        email: {
                            contains: filter,
                            mode: 'insensitive'
                        }
                    },
                    {
                        first_name: {
                            contains: filter,
                            mode: 'insensitive'
                        }
                    },
                    {
                        last_name: {
                            contains: filter,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                avatar: true,
                created_at: true
            },
            take: 10 // Limit results to 10 users
        })

        return {
            message: "Users fetched successfully",
            payload: users,
            error: false
        }
    })
} 