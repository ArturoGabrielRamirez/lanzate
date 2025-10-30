"use server"

import { updateUserAvatarData, updateUserBannerData } from "@/features/auth/data"
import { getCurrentUserMediaData } from "@/features/auth/data/get-current-user-media.data"
import { StorageService } from "@/features/global/services/storage"
import { FileUploadData, UPLOAD_TYPES, UploadResult } from "@/features/global/types/media"
import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"

export async function handleUserUploadAction(
    uploadData: FileUploadData,
    userId: number,
    username: string,
    storage: StorageService
) {
    return actionWrapper(async () => {
        const { file, type } = uploadData
        const currentUser = await getCurrentUserMediaData(userId)
        const currentUrl = type === UPLOAD_TYPES.AVATAR
            ? currentUser?.avatar
            : currentUser?.banner
        const publicUrl = await storage.uploadFile(file, type, userId)
        if (currentUrl && currentUrl.includes('.supabase.')) {
            await storage.deleteUserFile(currentUrl)
        }
        const updatedUser = type === UPLOAD_TYPES.BANNER
            ? await updateUserBannerData(userId, publicUrl)
            : await updateUserAvatarData(userId, publicUrl)
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