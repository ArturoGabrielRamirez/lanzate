"use server"

import { prisma } from "@/utils/prisma"

export async function cancelUserAccountData(suscriptionId: string) {

    const account = await prisma.account.findFirst({
        where: {
            suscription_id: suscriptionId
        },
        include: {
            user: true
        }
    })

    if (!account) {
        throw new Error("Account not found")
    }

    await prisma.account.update({
        where: {
            id: account.id
        },
        data: {
            type: "FREE",
            suscription_id: null
        }
    })

    return {
        payload: account,
        hasError: false,
        message: "Account cancelled successfully"
    }
}