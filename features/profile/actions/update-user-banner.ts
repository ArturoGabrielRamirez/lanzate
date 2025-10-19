/* import { getCurrentUser } from "@/features/auth/actions/get-current-user"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function updateUserBanner(bannerUrl: string) {
    return actionWrapper(async () => {
        const currentUserResponse = await getCurrentUser()

        if (!currentUserResponse || currentUserResponse.error) {
            return formatErrorResponse("Debes iniciar sesión para actualizar tu banner", null)
        }

        if (!bannerUrl || typeof bannerUrl !== 'string') {
            return formatErrorResponse("URL de banner inválida", null)
        }

        let userId: number

        if (typeof currentUserResponse.payload.id === 'string') {
            const user = await prisma.user.findUnique({
                where: { supabase_user_id: currentUserResponse.payload.id },
                select: { id: true }
            })

            if (!user) {
                return formatErrorResponse("Usuario no encontrado", null)
            }

            userId = user.id
        } else {
            userId = currentUserResponse.payload.id
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                banner: bannerUrl,
                updated_at: new Date()
            },
            select: {
                id: true,
                username: true,
                banner: true,
                first_name: true,
                last_name: true
            }
        })

        return formatSuccessResponse("Banner actualizado correctamente", {
            user: updatedUser,
            bannerUrl: bannerUrl
        })
    })
} */