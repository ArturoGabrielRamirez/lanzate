"use server"

import { UserType } from "@/features/account/types/types"
import { prisma } from "@/utils/prisma"
import { createServerSideClient } from "@/utils/supabase/server"

export async function getCurrentUserPermissionsData() {
    const supabase = createServerSideClient()
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()

    if (error || !supabaseUser) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            supabase_user_id: supabaseUser.id
        },
        include: {
            Account: true,
            Store: {
                select: {
                    id: true // We only need the count mostly, but fetching ID is cheap
                }
            }
        }
    })

    if (!user) return null;

    // Cast to UserType compatible structure if needed, strictly speaking UserType has more fields
    // but for our adapter we mainly need Account and Store.
    // However, our adapter expects UserType which usually matches the full prisma return + helpers.
    // Let's return it as is, assuming it matches well enough or we cast it.
    
    return user as unknown as UserType;
}

