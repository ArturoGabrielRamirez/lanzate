'use server'

import { DELETION_CONFIG } from "@/features/account/config/deletion.config"
import { findUserByEmail, findAnonymizedUserByEmailHash } from "@/features/account/data/index"
import { CryptoUtils } from "@/features/account/utils/crypto-utils"
import { actionWrapper, formatSuccessResponse } from '@/features/global/utils'

export async function validateNewUserCreationAction(email: string) {
    return actionWrapper(async () => {
        const emailHash = CryptoUtils.hashEmail(email)

        const activeUser = await findUserByEmail(email)

        if (activeUser) {
            return formatSuccessResponse('Validación completada', {
                canCreate: false,
                reason: 'El correo electrónico ya está en uso por una cuenta activa',
                conflict: true,
            })
        }

        const anonymizedUser = await findAnonymizedUserByEmailHash(emailHash)

        return formatSuccessResponse('Validación completada', {
            canCreate: true,
            reason: '',
            conflict: false,
            previouslyAnonymized: !!anonymizedUser,
            anonymizedAt: anonymizedUser?.anonymized_at,
            legalRetentionUntil: anonymizedUser?.account_locked_until,
            processingMethod: 'supabase_pg_cron',
            testingMode: DELETION_CONFIG.IS_TESTING_MODE,
        })
    })
}