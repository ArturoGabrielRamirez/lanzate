"use server"

import { prisma } from "@/utils/prisma"

export async function updateUserAccountData({ suscriptionId, email }: { suscriptionId: string, email: string }) {

    const user = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            Account: true
        }
    })

    if (!user) {
        throw new Error("Usuario no encontrado")
    }

    await prisma.account.update({
        where: {
            id: user.Account?.[0]?.id
        },
        data: {
            type: "PRO",
            suscription_id: suscriptionId
        }
    })

    return {
        payload: user,
        hasError: false,
        message: "Cuenta de usuario actualizada exitosamente"
    }
}