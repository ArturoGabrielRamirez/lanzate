"use server"

import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { UpdateMediaPresetParams } from "../types"
import { getUserId } from "@/features/shared/data/get-user-id"
import { getCurrentUserWithIdAndEmailAction } from "@/features/auth/actions"
import { validateUploadType } from "@/features/shared/utils/validators"
import { UPLOAD_TYPES } from "@/features/shared/types"
import { updateUserAvatar, updateUserBanner } from "@/features/shared/data"
import { revalidatePath } from "next/cache"

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
