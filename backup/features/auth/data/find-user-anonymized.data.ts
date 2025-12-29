"use server"

import { EmailData } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"

export async function findUserAnonymizedData({ email }: EmailData) {
    const activeUser = await prisma.user.findFirst({
        where: {
            email: email,
            is_anonymized: false,
        }
    })

    if (activeUser) return {
        error: true,
        message: "Ya existe un usuario con ese correo, por favor intente con otro",
        payload: activeUser
    }
    return {
        error: false,
        message: "Correo disponible para registrarse",
        payload: null
    }
}