"use server"

import { Account, Employee, User } from "@prisma/client"
import { formatErrorResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function getUserByEmail(email: string): Promise<{
    payload: User & { Account: Account[] } & { Employee: Employee[] } | null,
    error: boolean,
    message: string
}> {

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                Account: true,
                Employee: true
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

