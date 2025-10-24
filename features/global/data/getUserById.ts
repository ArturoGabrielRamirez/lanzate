"use server"

import { Account, User } from '@prisma/client'

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"


export async function getUserById(id: number): Promise<{
    payload: User & { Account: Account[] } | null,
    error: Boolean,
    message: string
}> {
    return actionWrapper(async () => {

        /* const prisma = new PrismaClient() */

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

    })
}

