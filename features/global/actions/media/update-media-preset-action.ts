"use server"

import { actionWrapper, formatErrorResponse, formatSuccessResponse } from '../../utils'
import { UpdateMediaPresetParams } from "../../components/media-selector/types"
import { getUserId } from "@/features/auth/data/get-user-id"
import { getCurrentUserWithIdAndEmailAction } from "@/features/auth/actions"
import { validateUploadType } from "@/features/global/utils/media/validators"
import { revalidatePath } from "next/cache"
import { UPLOAD_TYPES } from "../../types/media"
import { updateUserBanner } from '@/features/auth/data/update-user-banner'
import { updateUserAvatar } from '@/features/auth/data/update-user-avatar'

export async function updateMediaPresetAction({ type, presetUrl }: UpdateMediaPresetParams) {
    return actionWrapper(async () => {
        // 1. Autenticación
        const currentUserResponse = await getCurrentUserWithIdAndEmailAction()
        if (!currentUserResponse || currentUserResponse.error) {
            return formatErrorResponse('Debes iniciar sesión', null)
        }

        const user = await getUserId({
            ...currentUserResponse,
            error: currentUserResponse.message
        })

        // 2. Validación
        validateUploadType(type)

        if (!presetUrl || typeof presetUrl !== 'string') {
            return formatErrorResponse('URL inválida', null)
        }

        // 3. Actualizar según tipo
        const updatedUser = type === UPLOAD_TYPES.BANNER
            ? await updateUserBanner(user.id, presetUrl)
            : await updateUserAvatar(user.id, presetUrl)

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
