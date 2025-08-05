"use server"

import { prisma } from "@/utils/prisma"

export async function insertUser(email: string, password: string) {

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

}
