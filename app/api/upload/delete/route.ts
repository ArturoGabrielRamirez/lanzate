import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUserWithIdAndEmailAction } from '@/features/auth/actions'
import { handleUserDeleteAction } from '@/features/auth/actions/handle-user-delete.action'
import { getUserId } from '@/features/auth/data/get-user-id'
import { createStorageService } from '@/features/global/services/storage'
import { UPLOAD_TYPES } from '@/features/global/types/media'
import { ValidationError } from '@/features/global/utils/media/validators'

export async function POST(request: NextRequest) {
    try {
        // Verificar autenticación
        const currentUserResponse = await getCurrentUserWithIdAndEmailAction()
        if (!currentUserResponse || currentUserResponse.hasError) {
            return NextResponse.json(
                { hasError: true, message: 'No autenticado' },
                { status: 401 }
            )
        }

        /*  const user = await getUserId({
             ...currentUserResponse,
             error: currentUserResponse.message
         }) */

        const user = await getUserId({ payload: { id: currentUserResponse.payload?.id }, error: currentUserResponse.message })

        // Parsear body
        const body = await request.json()
        const { type } = body

        // Validar tipo
        if (!type) {
            throw new ValidationError('El tipo de archivo es requerido')
        }

        if (type !== UPLOAD_TYPES.AVATAR && type !== UPLOAD_TYPES.BANNER) {
            throw new ValidationError('Solo se pueden eliminar avatares y banners')
        }

        // Crear servicio de storage
        const storage = createStorageService()

        // Ejecutar eliminación
        const result = await handleUserDeleteAction(
            type,
            user.id,
            user.username,
            storage
        )

        if (result.hasError) {
            return NextResponse.json(
                { error: result.message },
                { status: 500 }
            )
        }

        return NextResponse.json(result.payload)

    } catch (error) {
        console.error('Error en DELETE endpoint:', error)

        if (error instanceof ValidationError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.statusCode }
            )
        }

        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                details: process.env.NODE_ENV === 'development'
                    ? (error instanceof Error ? error.message : String(error))
                    : undefined
            },
            { status: 500 }
        )
    }
}