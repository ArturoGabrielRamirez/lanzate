import { CurrentUserResponse, SimpleUser } from "@/features/global/types/media"
import { prisma } from "@/utils/prisma"

//TODO: Eliminar este archivo o revisarlo porque se repite
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