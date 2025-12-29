"use server"

import { revalidatePath } from "next/cache"

import { getCurrentUserWithIdAndEmailAction } from '@/features/auth/actions'
import { getUserId } from '@/features/auth/data/get-user-id'
import { getUserMediaByType } from '@/features/auth/data/get-user-media-by-type'
import { updateUserMedia } from '@/features/auth/data/update-user-media'
import { createStorageService } from '@/features/global/services/storage'
import { DeleteMediaParams, DeleteMediaResponse, UPLOAD_TYPES } from "@/features/global/types/media"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from '@/features/global/utils'
import { getStoragePath } from "@/features/global/utils/media/get-storege-path" // Importante
import { validateUploadType } from "@/features/global/utils/media/validators"
import { deleteProductMediaData } from "@/features/products/data/delete-product-media.data"
import { getProductMediaByIdData } from "@/features/products/data/get-product-media-by-id.data"
import { getDefaultBannerForUser } from "@/features/profile/utils/get-default-banner-for-user"
import { handleStoreDeleteAction } from "@/features/stores/actions/handle-store-delete.action"

export async function deleteMediaAction({ type, mediaUrl, mediaId, storeId }: DeleteMediaParams) {
  return actionWrapper<DeleteMediaResponse>(async () => {
    const currentUserResponse = await getCurrentUserWithIdAndEmailAction()
    if (!currentUserResponse || currentUserResponse.hasError) {
      return formatErrorResponse('Por favor, iniciá sesión para poder eliminar este archivo')
    }

    const user = await getUserId({
      payload: { id: currentUserResponse.payload?.id },
      error: currentUserResponse.message
    })

    validateUploadType(type)
    const storage = createStorageService()
    
    const { bucket } = getStoragePath(type)

    // Eliminar media de tienda
    if (type === UPLOAD_TYPES.STORE_LOGO || type === UPLOAD_TYPES.STORE_BANNER) {
      if (!storeId) return formatErrorResponse('storeId requerido')
      return await handleStoreDeleteAction(type, storeId, user.id)
    }

    // Eliminar media de producto
    if (mediaId) {
      const media = await getProductMediaByIdData(mediaId)

      if (!media) return formatErrorResponse('Media no encontrada')
      if (media.product.owner_id !== user.id) return formatErrorResponse('Sin permisos')

      // Verificar si la URL pertenece al bucket de productos
      if (media.url?.includes(bucket)) {
        const filename = media.url.split('/').pop()
        if (filename) {
          // Eliminamos directamente del bucket de productos
          await storage.deleteFile(filename, bucket)
        }
      }

      await deleteProductMediaData(mediaId)
      revalidatePath('/products')
      return formatSuccessResponse('Media eliminado', { mediaId })
    }

    // Eliminar avatar/banner de usuario
    if (type === UPLOAD_TYPES.AVATAR || type === UPLOAD_TYPES.BANNER) {
      const userData = await getUserMediaByType(user.id)
      if (!userData) return formatErrorResponse('Usuario no encontrado')

      const currentUrl = type === 'avatar' ? userData.avatar : userData.banner
      const urlToDelete = mediaUrl || currentUrl

      // Detectar si es upload personalizado verificando si contiene el nombre del bucket
      const isCustomUpload = urlToDelete?.includes(bucket)

      if (isCustomUpload && urlToDelete) {
        // Al estar en la raíz del bucket, el nombre del archivo es la última parte
        const filename = urlToDelete.split('/').pop()
        
        if (filename) {
          // Verificar que el archivo pertenece al usuario usando regex sobre el nombre
          // Patrón esperado: type-userId-timestamp (ej: avatar-55-123456.jpg)
          const fileUserIdRegex = new RegExp(`^${type}-(\\d+)-`)
          const match = filename.match(fileUserIdRegex)
          
          if (match && parseInt(match[1]) === user.id) {
            await storage.deleteFile(filename, bucket)
          }
        }
      }

      // Actualizar BD - Solo si era el media actual
      let updatedUser = userData
      if (currentUrl === urlToDelete) {
        const newValue = type === 'banner' ? getDefaultBannerForUser(user.id) : null
        updatedUser = await updateUserMedia(user.id, type, newValue)
      }

      // Revalidar paths
      revalidatePath('/profile')
      revalidatePath(`/profile/${user.username}`)
      revalidatePath('/settings')

      return formatSuccessResponse(
        isCustomUpload ? `${type} eliminado del storage` : `${type} removido`,
        {
          user: updatedUser,
          deletedFromStorage: isCustomUpload
        }
      )
    }

    return formatErrorResponse('Tipo de eliminación no válido')
  })
}