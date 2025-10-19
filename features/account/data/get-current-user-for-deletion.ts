import { prisma } from "@/utils/prisma"
import { createServerSideClient } from "@/utils/supabase/server"

export async function getCurrentUserForDeletion() {
    const supabase = createServerSideClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return null
    }

    return await prisma.user.findUnique({
        where: { supabase_user_id: user.id },
        select: { id: true, email: true }
    })
}