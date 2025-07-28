"use server"

import { PrismaClient, User, Account } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"


export async function getUserById(id: number): Promise<{
    payload: User & { Account: Account[] } | null,
    error: Boolean ,
    message: string
}> {
    try {

        const prisma = new PrismaClient()
        const user = await prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                Account: true
            }
        })

        if (!user) {
            throw new Error("User not found")
        }

        return {
            payload: user,
            error: false,
            message: "User found"
        }

    } catch (error) {
        return formatErrorResponse("Error fetching user", error)
    }
}

