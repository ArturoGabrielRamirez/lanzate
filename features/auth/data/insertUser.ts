"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

export async function insertUser(email: string, password: string) {
    try {

        const prisma = new PrismaClient()
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
            error: null,
            message: "User created"
        }

    } catch (error) {
        console.log("🚀 ~ insertUser ~ error:", error)
        return formatErrorResponse("Error creating user", error)
    }
}
