'use server'

import { actionWrapper, formatSuccessResponse } from "@/utils/lib"
import { findUserByEmail, findAnonymizedUserByEmailHash } from "../data"
import { CryptoUtils } from "../utils/crypto-utils"
import { DELETION_CONFIG } from "../config/deletion.config"

export async function validateNewUserCreationAction(email: string) {
    return actionWrapper(async () => {
        const emailHash = CryptoUtils.hashEmail(email)

        const activeUser = await findUserByEmail(email)

        if (activeUser) {
            return formatSuccessResponse('Validación completada', {
                canCreate: false,
                reason: 'Email already in use by active account',
                conflict: true,
            })
        }

        const anonymizedUser = await findAnonymizedUserByEmailHash(emailHash)

        return formatSuccessResponse('Validación completada', {
            canCreate: true,
            reason: null,
            conflict: false,
            previouslyAnonymized: !!anonymizedUser,
            anonymizedAt: anonymizedUser?.anonymized_at,
            legalRetentionUntil: anonymizedUser?.account_locked_until,
            processingMethod: 'supabase_pg_cron',
            testingMode: DELETION_CONFIG.IS_TESTING_MODE,
        })
    })
}