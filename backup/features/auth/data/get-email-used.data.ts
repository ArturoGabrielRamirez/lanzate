"use server"

import { EmailUsedParams } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"

export async function getEmailUsedData({ email, userId }: EmailUsedParams) {
    const emailInUse = await prisma.user.findFirst({
        where: {
            email: email,
            id: {
                not: userId
            }
        }
    })

    if (emailInUse) {
        return {
            hasError: true,
            message: "Este email ya está en uso por otro usuario",
            payload: null
        }
    }
}