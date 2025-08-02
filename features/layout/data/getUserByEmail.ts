"use server"

import { Account, User } from "@prisma/client"
import { formatErrorResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function getUserByEmail(email: string): Promise<{
    payload: User & { Account: Account[] } | null,
    error: Boolean,
    message: string
}> {

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                Account: true
            }
        })

        return {
            message: "User fetched successfully from database",
            error: false,
            payload: user
        }

    } catch (error) {
        return formatErrorResponse("Error fetching user", error, null)
    }
}

