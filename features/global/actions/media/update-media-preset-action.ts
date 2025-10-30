"use server"

import { revalidatePath } from "next/cache"

import { getCurrentUserWithIdAndEmailAction } from "@/features/auth/actions"
import { updateUserBannerData, updateUserAvatarData } from '@/features/auth/data'
import { getUserId } from "@/features/auth/data/get-user-id"
import { UpdateMediaPresetParams, UPLOAD_TYPES } from "@/features/global/types/media"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/features/global/utils"
import { validateUploadType } from "@/features/global/utils/media/validators"

export async function updateMediaPresetAction({ type, presetUrl }: UpdateMediaPresetParams) {
    return actionWrapper(async () => {
        // 1. Autenticación
        const currentUserResponse = await getCurrentUserWithIdAndEmailAction()
        if (!currentUserResponse || currentUserResponse.hasError) {
            return formatErrorResponse('Debes iniciar sesión')
        }

        const user = await getUserId({ payload: { id: currentUserResponse.payload?.id }, error: currentUserResponse.message })

        // 2. Validación
        validateUploadType(type)

        if (!presetUrl || typeof presetUrl !== 'string') {
            return formatErrorResponse('URL inválida')
        }

        // 3. Actualizar según tipo
        const updatedUser = type === UPLOAD_TYPES.BANNER
            ? await updateUserBannerData(user.id, presetUrl)
            : await updateUserAvatarData(user.id, presetUrl)

        // 4. Revalidar
        revalidatePath('/profile')
        revalidatePath(`/profile/${user.username}`)
        revalidatePath('/settings')

        return formatSuccessResponse(
            `${type === 'avatar' ? 'Avatar' : 'Banner'} actualizado`,
            {
                user: updatedUser,
                url: presetUrl
            }
        )
    })
}
