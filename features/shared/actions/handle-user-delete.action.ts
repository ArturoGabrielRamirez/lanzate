"use server"

import { getCurrentUser } from "@/features/auth/actions"
import { updateUserBanner, updateUserAvatar } from "@/features/shared/data/index"
import { StorageService } from "@/features/shared/services/storage"
import { UPLOAD_TYPES, DeleteResult } from "@/features/shared/types/types"
import { actionWrapper, formatSuccessResponse } from "@/utils/lib"

export async function handleUserDeleteAction(
    type: typeof UPLOAD_TYPES.AVATAR | typeof UPLOAD_TYPES.BANNER,
    userId: number,
    username: string,
    storage: StorageService
) {
    return actionWrapper(async () => {
        const currentUser = await getCurrentUser()

        const currentUrl = type === UPLOAD_TYPES.AVATAR
            ? currentUser.payload?.avatar
            : currentUser.payload?.banner

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