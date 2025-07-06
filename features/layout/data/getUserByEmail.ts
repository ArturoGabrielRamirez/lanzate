"use server"

import { PrismaClient, User } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"


export async function getUserByEmail(email: string): Promise<{
    payload: User | null,
    error: Error | null,
    message: string
}> {
    try {

        const prisma = new PrismaClient()
        const user = await prisma.user.findUnique({
            where: {
                email: email
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
            error: null,
            message: "User found"
        }

    } catch (error) {
        return formatErrorResponse("Error fetching user", error)
    }
}

