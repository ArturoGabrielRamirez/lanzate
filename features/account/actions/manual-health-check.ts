'use server'

import { actionWrapper, formatSuccessResponse } from "@/utils/lib"
import { getStatsFromData } from "../data"
import { DELETION_CONFIG } from "../config/deletion.config"

/**
 * Solo para testing/debug manual del sistema
 */
export async function manualHealthCheckAction() {
    return actionWrapper(async () => {
        const stats = await getStatsFromData()

        return formatSuccessResponse('Health check completado', {
            ...stats,
            manualCheck: true,
            note: 'En producción, pg_cron procesa automáticamente',
            cronInfo: {
                method: 'supabase_pg_cron',
                automaticExecution: true,
                frequencyTesting: DELETION_CONFIG.CRON.TESTING_FREQUENCY,
                frequencyProduction: DELETION_CONFIG.CRON.PRODUCTION_FREQUENCY,
            },
            timestamp: new Date().toISOString(),
            testingMode: DELETION_CONFIG.IS_TESTING_MODE,
        })
    })
}