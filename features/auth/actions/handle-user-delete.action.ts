"use server"

import { updateUserAvatarData, updateUserBannerData } from "@/features/auth/data"
import { getCurrentUserMediaData } from "@/features/auth/data/get-current-user-media.data"
import { StorageService } from "@/features/global/services/storage"
import { DeleteResult, UPLOAD_TYPES } from "@/features/global/types/media"
import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"

export async function handleUserDeleteAction(
    type: typeof UPLOAD_TYPES.AVATAR | typeof UPLOAD_TYPES.BANNER,
    userId: number,
    username: string,
    storage: StorageService
) {
    return actionWrapper(async () => {
        const currentUser = await getCurrentUserMediaData(userId)

        const currentUrl = type === UPLOAD_TYPES.AVATAR
            ? currentUser?.avatar
            : currentUser?.banner

        // Eliminar archivo físico del storage si existe
        if (currentUrl && currentUrl.includes('.supabase.')) {
            console.log(`Eliminando archivo físico de ${type}:`, currentUrl)
            await storage.deleteFile(currentUrl, type)
            console.log(`Archivo físico eliminado correctamente`)
        }

        // Actualizar la base de datos poniendo null
        const updatedUser = type === UPLOAD_TYPES.BANNER
            ? await updateUserBannerData(userId, null)
            : await updateUserAvatarData(userId, null)

        const result: DeleteResult = {
            message: `${type} eliminado correctamente`,
            user: updatedUser,
            username
        }

        return formatSuccessResponse(result.message, result)
    })
}