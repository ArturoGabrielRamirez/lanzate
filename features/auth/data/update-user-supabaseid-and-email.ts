"use server"

import { prisma } from "@/utils/prisma";

export async function updateUserSupabaseIdAndEmail(userId: number, supabaseId: string, email: string) {

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            supabase_user_id: supabaseId,
            email: email,
            updated_at: new Date()
        },
        include: {
            Account: true
        }
    })

    if (!user) throw new Error("User not found")

    return {
        payload: user,
        hasError: false,
        message: "User updated successfully"
    }

}