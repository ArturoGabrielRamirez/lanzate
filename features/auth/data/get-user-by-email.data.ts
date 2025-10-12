"use server"

import { prisma } from "@/utils/prisma"

export async function getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        include: {
            Account: true
        }
    });

    if (!user) throw new Error("Usuario no encontrado")

    return {
        payload: user,
        error: false,
        message: "Usuario encontrado"
    }
}