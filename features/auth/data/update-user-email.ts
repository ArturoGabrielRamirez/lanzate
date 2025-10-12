"use server"

import { prisma } from "@/utils/prisma";

export async function updateUserEmail(userId: number, email: string, withAccount: boolean = true) {

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            email: email,
            updated_at: new Date()
        },
        include: {
            Account: withAccount
        }
    })

    if (!user) throw new Error("User not found")

    return {
        payload: user,
        hasError: false,
        message: "User updated successfully"
    }

}