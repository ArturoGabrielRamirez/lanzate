"use server"

import { prisma } from "@/utils/prisma"

export async function updateUserAccountData({ /* suscriptionId, */ email }: { suscriptionId: string, email: string }) {

    const user = await prisma.user.findFirst({
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

    await prisma.account.update({
        where: {
            id: user.Account?.[0]?.id
        },
        data: {
            type: "PRO",
        }
    })

    return {
        payload: user,
        hasError: false,
        message: "User account updated successfully"
    }
}