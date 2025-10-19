/* import { prisma } from "@/utils/prisma";

export async function findUserBySupabaseId(supabaseUserId: string) {
    return prisma.user.findUnique({
        where: { supabase_user_id: supabaseUserId },
        select: { id: true }
    })
} */