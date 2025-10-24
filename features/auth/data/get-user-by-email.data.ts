"use server"

import { GetUserByEmailParams } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"

export async function getUserByEmailData({ supabaseUserEmail }: GetUserByEmailParams) {

    if (!supabaseUserEmail) throw new Error("Email is required")

    const backupUser = await prisma.user.findUnique({
        where: { email: supabaseUserEmail },
        select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            banner: true,
            first_name: true,
            last_name: true,
            supabase_user_id: true,
            created_at: true,
            profile_is_public: true
        }
    })

    if (!backupUser) throw new Error("Usuario no encontrado en la base de datos")

    return {
        hasError: false,
        payload: backupUser,
        message: "Usuario encontrado"
    }
}