'use server'

import { DELETION_CONFIG, getGracePeriod, getRetentionPeriod } from "@/features/account/config/deletion.config"
import { getStatsFromData } from "@/features/account/data/index"
import { actionWrapper, formatSuccessResponse } from "@/utils/lib"

export async function getSystemStatusAction() {
    return actionWrapper(async () => {
        const stats = await getStatsFromData()
        const gracePeriod = getGracePeriod()
        const retention = getRetentionPeriod()

        return formatSuccessResponse('Estado del sistema obtenido exitosamente', {
            ...stats,
            systemHealthy: stats.pendingDeletions < 100 && stats.expiredLegalRetention === 0,
            systemInfo: {
                processingMethod: 'supabase_pg_cron',
                cronFrequency: DELETION_CONFIG.IS_TESTING_MODE
                    ? DELETION_CONFIG.CRON.TESTING_FREQUENCY
                    : DELETION_CONFIG.CRON.PRODUCTION_FREQUENCY,
                automaticProcessing: true,
                manualInterventionRequired: false,
            },
            cronSystemStatus: {
                enabled: true,
                method: 'supabase_pg_cron',
                frequency: DELETION_CONFIG.IS_TESTING_MODE
                    ? DELETION_CONFIG.CRON.TESTING_FREQUENCY
                    : DELETION_CONFIG.CRON.PRODUCTION_FREQUENCY,
                nextExecution: DELETION_CONFIG.IS_TESTING_MODE
                    ? 'Within next minute'
                    : 'Tomorrow at 3:00 AM',
                requiresManualTrigger: false,
            },
            gracePeriodDays: 'days' in gracePeriod ? gracePeriod.days : 0,
            gracePeriodMinutes: 'minutes' in gracePeriod ? gracePeriod.minutes : 0,
            legalRetentionYears: 'years' in retention ? retention.years : 0,
            legalRetentionMinutes: 'minutes' in retention ? retention.minutes : 0,
            timestamp: new Date().toISOString(),
            testingMode: DELETION_CONFIG.IS_TESTING_MODE,
        })
    })
}