import { CurrentUserResponse, SimpleUser } from "@/features/shared/types/types"
import { prisma } from "@/utils/prisma"

export async function getUserId(currentUserResponse: CurrentUserResponse): Promise<SimpleUser> {
    if (typeof currentUserResponse.payload.id === 'string') {
        const user = await prisma.user.findUnique({
            where: { supabase_user_id: currentUserResponse.payload.id },
            select: { id: true, username: true }
        })

        if (!user) {
            throw new Error('Usuario no encontrado')
        }

        return user
    }

    const user = await prisma.user.findUnique({
        where: { id: currentUserResponse.payload.id },
        select: { id: true, username: true }
    })

    if (!user) {
        throw new Error('Usuario no encontrado')
    }

    return user
}