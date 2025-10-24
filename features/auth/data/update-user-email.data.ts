"use server"

import { UpdateUserEmailParams } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"

export async function updateUserEmailData({ userId, email, withAccount = true }: UpdateUserEmailParams) {
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