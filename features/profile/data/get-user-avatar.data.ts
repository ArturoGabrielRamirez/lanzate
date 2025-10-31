'use server'

import { prisma } from "@/utils/prisma";

export async function getUserAvatarData(supabaseUserId: string) {
    return await prisma.user.findFirst({
        where: { supabase_user_id: supabaseUserId },
        select: { id: true, email: true, avatar: true }
    })
}