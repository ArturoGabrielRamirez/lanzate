"use server"

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { updateUserBanner, updateUserAvatar } from "@/features/shared/data"
import { getCurrentUserMediaData } from "@/features/auth/data/get-current-user-media.data"
import { StorageService } from "@/features/global/services/storage"
import { FileUploadData, UPLOAD_TYPES, UploadResult } from "@/features/shared/types"


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