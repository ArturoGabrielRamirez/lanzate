"use server"

import { updateUserAvatarData, updateUserBannerData } from "@/features/auth/data"
import { PresetRequest, UPLOAD_TYPES, UploadResult } from "@/features/global/types/media"
import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"

export async function handlePresetUploadAction(
    data: PresetRequest,
    userId: number,
    username: string
) {
    return actionWrapper(async () => {
        const { type, presetUrl } = data

        const updatedUser = type === UPLOAD_TYPES.BANNER
            ? await updateUserBannerData(userId, presetUrl)
            : await updateUserAvatarData(userId, presetUrl)

        const result: UploadResult = {
            message: `${type === UPLOAD_TYPES.BANNER ? 'Banner' : 'Avatar'} actualizado correctamente`,
            url: presetUrl,
            username,
            user: updatedUser,
            type
        }

        return formatSuccessResponse(result.message, result)
    })
}