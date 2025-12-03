import { SupabaseClient } from '@supabase/supabase-js'

import { DeletionCheckResult } from '@/features/account/types'


export async function checkUserDeletionStatus(
    supabase: SupabaseClient,
    userId: string
): Promise<DeletionCheckResult | null> {
    try {

        const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('deletion_requested_at, is_anonymized, anonymized_at, deletion_scheduled_at, is_deletion_cancelled')
            .eq('supabase_user_id', userId)
            .single()

        // Manejo de errores de base de datos
        if (dbError || !userData) {
            // Registrar el error solo si no es un simple "no se encontró la fila" (PGRST116)
            if (dbError && dbError.code !== 'PGRST116') {
                console.error('Error fetching user deletion status (DB Error):', dbError)
            }

            // Retornar estado predeterminado si hay error o no hay datos.
            return {
                isDeletionRequested: false,
                canCancel: false,
                isAnonymized: false,
                displayScheduledAt: null,
            }
        }

        // --- LÓGICA DE NEGOCIO ---

        // 1. Usuario ya anonimizado
        if (userData.is_anonymized || userData.anonymized_at) {
            return {
                isDeletionRequested: true,
                canCancel: false,
                isAnonymized: true,
                displayScheduledAt: userData.deletion_scheduled_at,
            }
        }

        // 2. No hay solicitud de eliminación activa
        if (!userData.deletion_requested_at || userData.is_deletion_cancelled) {
            return {
                isDeletionRequested: false,
                canCancel: false,
                isAnonymized: false,
                displayScheduledAt: null,
            }
        }

        // 3. Hay solicitud de eliminación activa (Cálculo de fechas)
        const now = new Date()

        const requestedAt = new Date(userData.deletion_requested_at)
        const canCancelUntil = new Date(requestedAt)
        canCancelUntil.setDate(canCancelUntil.getDate() + 30) // 30 días para cancelar

        // Determinar si aún puede cancelar
        const canCancel = userData.deletion_scheduled_at
            ? now < canCancelUntil && now < new Date(userData.deletion_scheduled_at)
            : now < canCancelUntil

        return {
            isDeletionRequested: true,
            canCancel,
            isAnonymized: false,
            displayScheduledAt: userData.deletion_scheduled_at,
        }

    } catch (error) {
        // Esto captura el error si 'supabase' es undefined (el error anterior) o cualquier otra excepción de runtime.
        console.error('Error checking deletion status (Runtime Error):', error)
        return null
    }
}