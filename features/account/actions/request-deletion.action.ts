'use server'

import { headers } from 'next/headers'

import { DELETION_CONFIG, getGracePeriod } from "@/features/account/config/deletion.config"
import { getCurrentUserForDeletion, verifyUserPassword } from "@/features/account/data/index"
import { calculateScheduledDeletionDate } from "@/features/account/utils/deletion-calculator"
import { getDisplayScheduledDate } from "@/features/account/utils/deletion-helpers"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { prisma } from '@/utils/prisma'

export async function requestDeletionAction(reason: string, password: string) {
    return actionWrapper(async () => {

        const headersList = headers()
        const ipAddress = (await headersList).get('x-forwarded-for') ||
            (await headersList).get('x-real-ip') || '127.0.0.1'
        const userAgent = (await headersList).get('user-agent') || 'Unknown'
        const currentUser = await getCurrentUserForDeletion()

        if (!currentUser) {
            return formatErrorResponse('Usuario no encontrado', null)
        }

        const isPasswordValid = await verifyUserPassword(currentUser.email, password)

        if (!isPasswordValid) {
            return formatErrorResponse('Contraseña incorrecta', null)
        }

        const deletionRequestedAt = new Date()
        const deletionScheduledAt = calculateScheduledDeletionDate()

        if (DELETION_CONFIG.IS_TESTING_MODE) {
            console.log(`Testing: Eliminación programada para ${deletionScheduledAt.toLocaleString()}`)
        }

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: currentUser.id },
                select: { email: true, Account: true, Store: true },
            })

            if (!user) throw new Error('Usuario no encontrado')

            await tx.user.update({
                where: { id: currentUser.id },
                data: {
                    deletion_requested_at: deletionRequestedAt,
                    deletion_scheduled_at: deletionScheduledAt,
                    deletion_reason: reason,
                    deletion_ip_address: ipAddress,
                    deletion_user_agent: userAgent,
                    is_deletion_cancelled: false,
                    deletion_cancelled_at: null,
                    deletion_cancelled_reason: null,
                },
            })

            const gracePeriod = getGracePeriod()

            await tx.userDeletionLog.create({
                data: {
                    user_id: currentUser.id,
                    action: 'REQUEST',
                    reason,
                    ip_address: ipAddress,
                    user_agent: userAgent,
                    additional_data: JSON.stringify({
                        scheduled_for: deletionScheduledAt.toISOString(),
                        display_scheduled_for: getDisplayScheduledDate(deletionScheduledAt)?.toISOString(),
                        processing_method: 'supabase_pg_cron',
                        cron_frequency: DELETION_CONFIG.IS_TESTING_MODE
                            ? DELETION_CONFIG.CRON.TESTING_FREQUENCY
                            : DELETION_CONFIG.CRON.PRODUCTION_FREQUENCY,
                        grace_period: gracePeriod,
                        testing_mode: DELETION_CONFIG.IS_TESTING_MODE,
                        legal_basis: 'Article 17 GDPR - Right to erasure',
                    }),
                },
            })

            return {
                deletionRequestedAt,
                deletionScheduledAt,
                displayScheduledAt: getDisplayScheduledDate(deletionScheduledAt),
                processingMethod: 'supabase_pg_cron',
                cronFrequency: DELETION_CONFIG.IS_TESTING_MODE
                    ? DELETION_CONFIG.CRON.TESTING_FREQUENCY
                    : DELETION_CONFIG.CRON.PRODUCTION_FREQUENCY,
                gracePeriodDays: 'days' in gracePeriod ? gracePeriod.days : 0,
                gracePeriodMinutes: 'minutes' in gracePeriod ? gracePeriod.minutes : 0,
                testingMode: DELETION_CONFIG.IS_TESTING_MODE,
                automaticProcessing: true,
            }
        })

        return formatSuccessResponse('Eliminación solicitada exitosamente', result)
    })
}