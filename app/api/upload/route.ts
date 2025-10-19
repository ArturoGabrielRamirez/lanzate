/* "use server" */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/features/auth/actions'
import { createStorageService } from '../../../features/shared/services/storage'
import {
  ValidationError,
  validateUploadType,
  validateFile,
  validateFileSize,
  validateFileType,
  validatePresetType,
  validatePresetData
} from '../../../features/shared/utils/validators'
import { PresetRequest, UPLOAD_TYPES, type FileUploadData } from '../../../features/shared/types/types'
import { handlePresetUpload } from '@/features/shared/actions/handle-preset-upload'
import { handleUserUpload } from '@/features/shared/actions/handle-user-upload'
import { handleProductUpload } from '@/features/shared/actions/handle-product-upload'
import { handleStoreUpload } from '@/features/shared/actions/handle-store-upload'
import { getUserId } from '@/features/shared/data/get-user-id'


export async function POST(request: NextRequest) {
  try {

    const currentUserResponse = await getCurrentUser()

    if (!currentUserResponse || currentUserResponse.error) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para subir archivos' },
        { status: 401 }
      )
    }

    const user = await getUserId({
      ...currentUserResponse,
      error: currentUserResponse.message
    })
    const contentType = request.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      const data = await request.json()

      try {
        validatePresetData(data)
        validateUploadType(data.type)
        validatePresetType(data.type)

        const result = await handlePresetUpload(
          data as PresetRequest,
          user.id,
          user.username
        )

        if (result.error) {
          return NextResponse.json(
            { error: result.message },
            { status: 500 }
          )
        }

        return NextResponse.json(result.payload)
      } catch (error) {
        if (error instanceof ValidationError) {
          return NextResponse.json(
            { error: error.message },
            { status: error.statusCode }
          )
        }
        throw error
      }
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    const productId = formData.get('productId')
      ? parseInt(formData.get('productId') as string)
      : null
    const storeId = formData.get('storeId')
      ? parseInt(formData.get('storeId') as string)
      : null


    try {
      validateFile(file)
      validateUploadType(type)
      validateFileSize(file)
      validateFileType(file)

      const uploadData: FileUploadData = {
        file,
        type,
        productId,
        storeId
      }

      const storage = createStorageService()
      let actionResult

      if (type === UPLOAD_TYPES.AVATAR || type === UPLOAD_TYPES.BANNER) {
        actionResult = await handleUserUpload(uploadData, user.id, user.username, storage)
      } else if (type === UPLOAD_TYPES.PRODUCT_IMAGE || type === UPLOAD_TYPES.PRODUCT_VIDEO) {
        actionResult = await handleProductUpload(uploadData, user.id, user.username, storage)
      } else if (type === UPLOAD_TYPES.STORE_LOGO || type === UPLOAD_TYPES.STORE_BANNER) {
        actionResult = await handleStoreUpload(uploadData, user.id, user.username, storage)
      } else {
        throw new ValidationError('Tipo de upload no soportado')
      }

      if (actionResult.error) {
        return NextResponse.json(
          { error: actionResult.message },
          { status: 500 }
        )
      }

      return NextResponse.json(actionResult.payload)

    } catch (error) {
      if (error instanceof ValidationError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        )
      }
      throw error
    }

  } catch (error) {
    console.error('Error crítico en API:', error)
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