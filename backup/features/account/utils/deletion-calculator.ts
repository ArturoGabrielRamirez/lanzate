import { DELETION_CONFIG, getGracePeriod } from '@/features/account/config/deletion.config'
import { getDaysRemaining, getDisplayScheduledDate } from '@/features/account/utils'


export function calculateScheduledDeletionDate(): Date {
    const scheduledAt = new Date()
    const gracePeriod = getGracePeriod()

    if ('minutes' in gracePeriod) {
        scheduledAt.setMinutes(scheduledAt.getMinutes() + gracePeriod.minutes!)
    } else {
        scheduledAt.setDate(scheduledAt.getDate() + gracePeriod.days)
    }

    return scheduledAt
}

export function calculateDeletionStatus(user: {
    deletion_requested_at: Date | null
    deletion_scheduled_at: Date | null
    deletion_reason: string | null
    is_deletion_cancelled: boolean
    is_anonymized: boolean
    anonymized_at: Date | null
    account_locked_until: Date | null
}) {
    if (!user.deletion_requested_at) {
        return {
            isDeletionRequested: false,
            deletionRequestedAt: null,
            deletionScheduledAt: null,
            displayScheduledAt: null,
            deletionReason: null,
            canCancel: false,
            daysRemaining: 0,
            minutesRemaining: 0,
            canDeleteUntil: null,
            canCancelUntil: null,
            isWithinActionWindow: false,
            isAnonymized: user.is_anonymized || false,
            anonymizedAt: null,
            legalRetentionUntil: null,
            legalStatus: user.is_anonymized ? 'legally_processed' : 'active'
        }
    }

    const now = new Date()
    const scheduledAt = user.deletion_scheduled_at!

    // 🔥 La fecha redondeada que ve el usuario
    const displayScheduledAt = getDisplayScheduledDate(scheduledAt)
    const daysRemaining = getDaysRemaining(scheduledAt)

    // Calcular minutos restantes hasta la fecha ORIGINAL (para precisión interna)
    const timeDifference = scheduledAt.getTime() - now.getTime()
    const minutesRemaining = Math.max(0, Math.ceil(timeDifference / (1000 * 60)))

    // 🔥 CORRECCIÓN: Usar displayScheduledAt para determinar si puede cancelar
    // El usuario ve la hora redondeada, entonces puede cancelar hasta esa hora
    const canCancel = displayScheduledAt
        ? (now < displayScheduledAt && !user.is_deletion_cancelled && !user.is_anonymized)
        : false

    // 🔥 CORRECCIÓN: Calcular ventana de acción usando displayScheduledAt
    const actionWindowMinutes = DELETION_CONFIG.IS_TESTING_MODE ? 1 : 60
    const actionWindowStart = displayScheduledAt
        ? new Date(displayScheduledAt.getTime() - (actionWindowMinutes * 60 * 1000))
        : null

    const isWithinActionWindow = displayScheduledAt && actionWindowStart
        ? (now >= actionWindowStart && now < displayScheduledAt)
        : false

    return {
        isDeletionRequested: true,
        deletionRequestedAt: user.deletion_requested_at,
        deletionScheduledAt: user.deletion_scheduled_at,
        displayScheduledAt, // Esta es la fecha redondeada que ve el usuario
        deletionReason: user.deletion_reason,
        canCancel, // Basado en displayScheduledAt
        daysRemaining,
        minutesRemaining,
        canDeleteUntil: displayScheduledAt, // 🔥 Usar fecha redondeada
        canCancelUntil: canCancel ? displayScheduledAt : null, // 🔥 Usar fecha redondeada
        isWithinActionWindow,
        isAnonymized: user.is_anonymized || false,
        anonymizedAt: user.anonymized_at,
        legalRetentionUntil: user.account_locked_until,
        legalStatus: user.is_anonymized ? 'legally_processed' : 'pending_deletion'
    }
}