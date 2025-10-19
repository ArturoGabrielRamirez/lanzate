/* 
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { getDefaultBannerForUser } from "../utils/get-default-banner-for-user"

export async function assignDefaultBannerToUser(userId: number | string) {
    return actionWrapper(async () => {
        const userIdAsNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId

        if (isNaN(userIdAsNumber)) {
            return formatErrorResponse("ID de usuario inválido para asignar banner por defecto", null)
        }

        const defaultBanner = getDefaultBannerForUser(userIdAsNumber)

        const updatedUser = await prisma.user.update({
            where: { id: userIdAsNumber },
            data: {
                banner: defaultBanner,
                updated_at: new Date()
            },
            select: {
                id: true,
                username: true,
                banner: true
            }
        })

        return formatSuccessResponse("Banner por defecto asignado exitosamente", {
            user: updatedUser,
            banner: defaultBanner
        })
    })
}
 */