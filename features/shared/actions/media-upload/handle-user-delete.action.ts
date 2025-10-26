"use server"

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { updateUserBanner, updateUserAvatar } from "@/features/shared/data"
import { getCurrentUser } from "@/features/shared/data/get-current-user"
import { StorageService } from "@/features/shared/services/storage"
import { UPLOAD_TYPES, DeleteResult } from "@/features/shared/types"

export async function handleUserDeleteAction(
    type: typeof UPLOAD_TYPES.AVATAR | typeof UPLOAD_TYPES.BANNER,
    userId: number,
    username: string,
    storage: StorageService
) {
    return actionWrapper(async () => {
        const currentUser = await getCurrentUser(userId)

        const currentUrl = type === UPLOAD_TYPES.AVATAR
            ? currentUser?.avatar
            : currentUser?.banner

        // Eliminar archivo físico del storage si existe
        if (currentUrl && currentUrl.includes('.supabase.')) {
            console.log(`Eliminando archivo físico de ${type}:`, currentUrl)
            await storage.deleteUserFile(currentUrl)
            console.log(`Archivo físico eliminado correctamente`)
        }

        // Actualizar la base de datos poniendo null
        const updatedUser = type === UPLOAD_TYPES.BANNER
            ? await updateUserBanner(userId, null)
            : await updateUserAvatar(userId, null)

        const result: DeleteResult = {
            message: `${type} eliminado correctamente`,
            user: updatedUser,
            username
        }

        return formatSuccessResponse(result.message, result)
    })
}