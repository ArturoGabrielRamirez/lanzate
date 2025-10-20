"use server"

import { getCurrentUser } from "@/features/shared/data/get-current-user"
import { updateUserBanner, updateUserAvatar } from "@/features/shared/data/index"
import { StorageService } from "@/features/shared/services/storage"
import { FileUploadData, UPLOAD_TYPES, UploadResult } from "@/features/shared/types/types"
import { actionWrapper, formatSuccessResponse } from "@/utils/lib"

export async function handleUserUploadAction(
    uploadData: FileUploadData,
    userId: number,
    username: string,
    storage: StorageService
) {
    return actionWrapper(async () => {
        const { file, type } = uploadData
        const currentUser = await getCurrentUser(userId)
        const currentUrl = type === UPLOAD_TYPES.AVATAR
            ? currentUser?.avatar
            : currentUser?.banner
        const publicUrl = await storage.uploadFile(file, type, userId)
        if (currentUrl && currentUrl.includes('.supabase.')) {
            await storage.deleteUserFile(currentUrl)
        }
        const updatedUser = type === UPLOAD_TYPES.BANNER
            ? await updateUserBanner(userId, publicUrl)
            : await updateUserAvatar(userId, publicUrl)
        const result: UploadResult = {
            message: `${type} subido correctamente`,
            url: publicUrl,
            filename: file.name,
            originalSize: file.size,
            username,
            user: updatedUser,
            type
        }
        return formatSuccessResponse(result.message, result)
    })
}