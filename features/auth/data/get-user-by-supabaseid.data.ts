"use server"
import { User } from "@supabase/supabase-js"

import { prisma } from "@/utils/prisma"

export async function getUserBySupabaseId(supabaseUser: User) {

    const localUser = await prisma.user.findUnique({
        where: {
            supabase_user_id: supabaseUser.id
        },
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

    if (!localUser) throw new Error("Usuario no encontrado")

    return {
        hasError: false,
        message: "Usuario encontrado",
        payload: localUser
    }

}