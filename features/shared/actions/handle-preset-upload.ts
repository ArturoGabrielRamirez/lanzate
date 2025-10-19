"use server"

import { PresetRequest, UPLOAD_TYPES, UploadResult } from "@/features/shared/types/types"
import { actionWrapper, formatSuccessResponse } from "@/utils/lib"
import { updateUserAvatar, updateUserBanner } from "@/features/shared/data/index"

export async function handlePresetUpload(
    data: PresetRequest,
    userId: number,
    username: string
) {
    return actionWrapper(async () => {
        const { type, presetUrl } = data

        const updatedUser = type === UPLOAD_TYPES.BANNER
            ? await updateUserBanner(userId, presetUrl)
            : await updateUserAvatar(userId, presetUrl)

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