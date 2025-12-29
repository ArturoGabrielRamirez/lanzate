"use server"

import { UpdateSupabaseIdAndEmailParams } from "@/features/auth/types"
import { prisma } from "@/utils/prisma"

export async function updateUserSupabaseIdAndEmailData({ userId, supabaseId, email, withAccount = true }: UpdateSupabaseIdAndEmailParams) {
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            supabase_user_id: supabaseId,
            email: email,
            updated_at: new Date()
        },
        include: {
            Account: withAccount
        }
    })

    if (!user) throw new Error("User not found")

    return {
        payload: user,
        hasError: false,
        message: "User updated successfully"
    }

}