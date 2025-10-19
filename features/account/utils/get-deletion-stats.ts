/* 'use server'

import { actionWrapper, formatSuccessResponse } from "@/utils/lib"
import { getStatsFromData } from "../data"
import { DELETION_CONFIG, getGracePeriod, getRetentionPeriod } from "../config/deletion.config"

export async function getDeletionStatsAction() {
  return actionWrapper(async () => {
    // Obtiene stats GLOBALES de la DB (conteos de todos los usuarios)
    const stats = await getStatsFromData()

    const gracePeriod = getGracePeriod()
    const retention = getRetentionPeriod()

    return formatSuccessResponse('Estadísticas obtenidas exitosamente', {
      ...stats, // { pendingDeletions, anonymizedAccounts, expiredLegalRetention }
      systemInfo: {
        processingMethod: 'supabase_pg_cron',
        cronFrequency: DELETION_CONFIG.IS_TESTING_MODE
          ? DELETION_CONFIG.CRON.TESTING_FREQUENCY
          : DELETION_CONFIG.CRON.PRODUCTION_FREQUENCY,
        automaticProcessing: true,
        manualInterventionRequired: false,
      },
      gracePeriodDays: 'days' in gracePeriod ? gracePeriod.days : 0,
      gracePeriodMinutes: 'minutes' in gracePeriod ? gracePeriod.minutes : 0,
      legalRetentionYears: 'years' in retention ? retention.years : 0,
      legalRetentionMinutes: 'minutes' in retention ? retention.minutes : 0,
      testingMode: DELETION_CONFIG.IS_TESTING_MODE,
      lastChecked: new Date().toISOString(),
    })
  })
} */