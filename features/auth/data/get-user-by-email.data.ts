"use server"

import { User } from "@supabase/supabase-js"

import { prisma } from "@/utils/prisma"

export async function getUserByEmail(supabaseUser: User) {

    const backupUser = await prisma.user.findUnique({
        where: { email: supabaseUser.email! },
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