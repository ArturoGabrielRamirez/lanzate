'use server'

import { prisma } from "@/utils/prisma"

export async function getUserBannerData(supabaseUserId: string) {

    const user = await prisma.user.findFirst({
        where: { supabase_user_id: supabaseUserId },
        select: { id: true, email: true, banner: true }
    })

    if (!user) throw new Error('User not found')

    return user

}