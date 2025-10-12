"use server"

import { prisma } from "@/utils/prisma"

export async function getUserBySupabaseId(supabaseId: string,withAccount: boolean = true) {
    const localUser = await prisma.user.findUnique({
        where: {
            supabase_user_id: supabaseId
        },
        include: {
            Account: withAccount
        }
    });

    if (!localUser) throw new Error("Usuario no encontrado")

    return {
        payload: localUser,
        error: false,
        message: "Usuario encontrado"
    }
}