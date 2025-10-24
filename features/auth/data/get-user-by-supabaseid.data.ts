"use server"

import { GetUserBySupabaseIdParams } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"

export async function getUserBySupabaseIdData({ supabaseUserId }: GetUserBySupabaseIdParams) {
    
    if (!supabaseUserId) throw new Error("Supabase user ID is required")

    const localUser = await prisma.user.findUnique({
        where: {
            supabase_user_id: supabaseUserId as string
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