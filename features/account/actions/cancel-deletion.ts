'use server'

import { headers } from 'next/headers'
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { prisma } from '@/utils/prisma'
import { getCurrentUserForDeletion } from "../data"
import { DELETION_CONFIG } from "../config/deletion.config"

export async function cancelDeletionAction(reason: string) {
    return actionWrapper(async () => {
        // Obtener headers del request
        const headersList = headers()
        const ipAddress = (await headersList).get('x-forwarded-for') ||
            (await headersList).get('x-real-ip') ||
            '127.0.0.1'
        const userAgent = (await headersList).get('user-agent') || 'Unknown'

        // Obtener usuario actual
        const currentUser = await getCurrentUserForDeletion()

        if (!currentUser) {
            return formatErrorResponse('Usuario no encontrado', null)
        }

        const cancelledAt = new Date()

        const result = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: currentUser.id },
                data: {
                    deletion_requested_at: null,
                    deletion_scheduled_at: null,
                    deletion_reason: null,
                    deletion_ip_address: null,
                    deletion_user_agent: null,
                    is_deletion_cancelled: true,
                    deletion_cancelled_at: cancelledAt,
                    deletion_cancelled_reason: reason,
                },
            })

            await tx.userDeletionLog.create({
                data: {
                    user_id: currentUser.id,
                    action: 'CANCEL',
                    reason,
                    ip_address: ipAddress,
                    user_agent: userAgent,
                    additional_data: JSON.stringify({
                        cancelled_at: cancelledAt.toISOString(),
                        processing_method: 'supabase_pg_cron',
                        testing_mode: DELETION_CONFIG.IS_TESTING_MODE,
                        legal_basis: 'User withdrew deletion request',
                    }),
                },
            })

            return {
                cancelledAt,
                processingMethod: 'supabase_pg_cron',
                automaticProcessing: false,
            }
        })

        return formatSuccessResponse('Eliminación cancelada exitosamente', result)
    })
}