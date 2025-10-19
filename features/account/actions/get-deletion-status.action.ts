'use server'

import { DELETION_CONFIG } from "@/features/account/config/deletion.config"
import { getCurrentUserForDeletion, getUserForDeletion } from "@/features/account/data/index"
import { calculateDeletionStatus } from "@/features/account/utils/deletion-calculator"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"

export async function getDeletionStatusAction() {
    return actionWrapper(async () => {
        const currentUser = await getCurrentUserForDeletion()

        if (!currentUser) {
            return formatErrorResponse('Usuario no encontrado', null)
        }

        const user = await getUserForDeletion(currentUser.id)

        if (!user) {
            return formatErrorResponse('Usuario no encontrado', null)
        }

        const status = calculateDeletionStatus(user)

        return formatSuccessResponse('Estado de eliminación obtenido exitosamente', {
            ...status,
            processingMethod: 'supabase_pg_cron',
            testingMode: DELETION_CONFIG.IS_TESTING_MODE
        })
    })
}