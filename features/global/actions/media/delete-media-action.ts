"use server"

import { revalidatePath } from "next/cache"

import { getCurrentUserWithIdAndEmailAction } from '@/features/auth/actions'
import { getUserId } from "@/features/auth/data/get-user-id"
import { getUserMediaByType } from "@/features/auth/data/get-user-media-by-type"
import { updateUserMedia } from "@/features/auth/data/update-user-media"
import { createStorageService } from "@/features/global/services/storage"
import { DeleteMediaParams, DeleteMediaResponse, UPLOAD_TYPES } from "@/features/global/types/media"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/features/global/utils"
import { validateUploadType } from "@/features/global/utils/media/validators"
import { deleteProductMediaData } from "@/features/products/data/delete-product-media.data"
import { getProductMediaByIdData } from "@/features/products/data/get-product-media-by-id.data"
import { getDefaultBannerForUser } from "@/features/profile/utils/get-default-banner-for-user"

export async function deleteMediaAction({ type, mediaUrl, mediaId }: DeleteMediaParams) {
  return actionWrapper<DeleteMediaResponse>(async () => {
    // 1. Autenticación
    const currentUserResponse = await getCurrentUserWithIdAndEmailAction()
    if (!currentUserResponse || currentUserResponse.hasError) {
      return formatErrorResponse('Por favor, iniciá sesión para poder eliminar este archivo')
    }

    const user = await getUserId({ payload: { id: currentUserResponse.payload?.id }, error: currentUserResponse.message })

    // 2. Validación
    validateUploadType(type)
    const storage = createStorageService()

    // 3. CASO: Eliminar media de producto
    if (mediaId) {
      const media = await getProductMediaByIdData(mediaId)

      if (!media) {
        return formatErrorResponse('Media no encontrada')
      }

      if (media.product.owner_id !== user.id) {
        return formatErrorResponse('Sin permisos')
      }

      // Eliminar del storage si es upload personalizado
      if (media.url?.includes('user-uploads')) {
        const filename = media.url.split('/').pop()
        if (filename) {
          await storage.deleteFile(`products/${filename}`, 'user-uploads')
        }
      }

      await deleteProductMediaData(mediaId)
      revalidatePath('/products')

      return formatSuccessResponse('Media eliminado', { mediaId })
    }

    // 4. CASO: Eliminar avatar/banner de usuario
    if (type === UPLOAD_TYPES.AVATAR || type === UPLOAD_TYPES.BANNER) {
      const userData = await getUserMediaByType(user.id/* , type */) //TODO: Revisar si es necesario type

      if (!userData) {
        return formatErrorResponse('Usuario no encontrado')
      }

      const currentUrl = type === 'avatar' ? userData.avatar : userData.banner
      const urlToDelete = mediaUrl || currentUrl

      // 5. Detectar si es preset o upload personalizado
      const isUserUpload = urlToDelete?.includes('user-uploads')

      if (isUserUpload && urlToDelete) {
        // Extraer filename del URL
        const match = urlToDelete.match(/user-uploads\/(.+)$/)
        if (match) {
          const filePath = match[1] // avatars/avatar-xxx.jpg o banners/banner-xxx.jpg

          // Verificar que el archivo pertenece al usuario
          const fileUserId = filePath.match(new RegExp(`${type}s/${type}-(\\d+)-`))
          if (fileUserId && parseInt(fileUserId[1]) === user.id) {
            await storage.deleteFile(filePath, 'user-uploads')
          }
        }
      }

      // 6. Actualizar BD - Solo si era el media actual
      let updatedUser = userData
      if (currentUrl === urlToDelete) {
        const newValue = type === 'banner' ? getDefaultBannerForUser(user.id) : null
        updatedUser = await updateUserMedia(user.id, type, newValue)
      }

      // 7. Revalidar
      revalidatePath('/profile')
      revalidatePath(`/profile/${user.username}`)
      revalidatePath('/settings')

      return formatSuccessResponse(
        isUserUpload ? `${type} eliminado del storage` : `${type} removido`,
        {
          user: updatedUser,
          deletedFromStorage: isUserUpload
        }
      )
    }

    return formatErrorResponse('Tipo de eliminación no válido')
  })
}