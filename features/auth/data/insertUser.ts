"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper, formatErrorResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function insertUser(email: string, password: string) {
    return actionWrapper(async () => {

        /* const prisma = new PrismaClient() */

        const user = await prisma.user.create({
            data: {
                email: email,
                password: password,
                created_at: new Date(),
                updated_at: new Date(),
                Account: {
                    create: {
                        type: "FREE"
                    }
                }
            }
        })

        if (!user) {
            throw new Error("User not created")
        }

        return {
            payload: user,
            error: false,
            message: "User created"
        }

    })
}
