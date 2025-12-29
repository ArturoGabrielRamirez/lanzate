import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUserWithIdAndEmailAction } from '@/features/auth/actions'
import { handleUserDeleteAction } from '@/features/auth/actions/handle-user-delete.action'
import { getUserId } from '@/features/auth/data/get-user-id'
import { createStorageService } from '@/features/global/services/storage'
import { UPLOAD_TYPES } from '@/features/global/types/media'
import { ValidationError } from '@/features/global/utils/media/validators'
import { handleStoreDeleteAction } from '@/features/stores/actions/handle-store-delete.action'

export async function POST(request: NextRequest) {
  try {
    const currentUserResponse = await getCurrentUserWithIdAndEmailAction()
    if (!currentUserResponse || currentUserResponse.hasError) {
      return NextResponse.json(
        { hasError: true, message: 'No autenticado' },
        { status: 401 }
      )
    }

    const user = await getUserId({ 
      payload: { id: currentUserResponse.payload?.id }, 
      error: currentUserResponse.message 
    })

    const body = await request.json()
    const { type, storeId, productId } = body

    if (!type) {
      throw new ValidationError('El tipo de archivo es requerido')
    }

    const storage = createStorageService()
    let result

    if (type === UPLOAD_TYPES.AVATAR || type === UPLOAD_TYPES.BANNER) {
      result = await handleUserDeleteAction(type, user.id, user.username, storage)
    } 
    else if (type === UPLOAD_TYPES.STORE_LOGO || type === UPLOAD_TYPES.STORE_BANNER) {
      if (!storeId) {
        throw new ValidationError('storeId es requerido para eliminar multimedia de tienda')
      }
      result = await handleStoreDeleteAction(type, storeId, user.id)
    }
    else if (type === UPLOAD_TYPES.PRODUCT_IMAGE || type === UPLOAD_TYPES.PRODUCT_VIDEO) {
      if (!productId) {
        throw new ValidationError('productId es requerido para eliminar multimedia de producto')
      }
      // TODO: Implementar handleProductDeleteAction
      throw new ValidationError('Eliminación de multimedia de productos no implementada aún')
    }
    else {
      throw new ValidationError('Tipo no soportado para eliminación')
    }

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