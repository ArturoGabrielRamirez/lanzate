"use server"

import { getDefaultBannerForUser } from "@/features/profile/utils/get-default-banner-for-user"
import { deleteProductMedia, getProductMediaById, getUserMediaByType, updateUserMedia } from "@/features/shared/data"
import { getUserId } from "@/features/shared/data/get-user-id"
import { createStorageService } from "@/features/shared/services/storage"
import { UPLOAD_TYPES } from "@/features/shared/types"
import { validateUploadType } from "@/features/shared/utils/validators"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"
import { revalidatePath } from "next/cache"
import { getCurrentUserWithIdAndEmailAction } from '@/features/auth/actions'
import { DeleteMediaParams } from "../types"


export async function deleteMediaAction({ type, mediaUrl, mediaId }: DeleteMediaParams) {
  return actionWrapper(async () => {
    // 1. Autenticación
    const currentUserResponse = await getCurrentUserWithIdAndEmailAction()
    if (!currentUserResponse || currentUserResponse.error) {
      return formatErrorResponse('Debes iniciar sesión', null)
    }

    const user = await getUserId({
      ...currentUserResponse,
      error: currentUserResponse.message
    })

    // 2. Validación
    validateUploadType(type)
    const storage = createStorageService()

    // 3. CASO: Eliminar media de producto
    if (mediaId) {
      const media = await getProductMediaById(mediaId)

      if (!media) {
        return formatErrorResponse('Media no encontrada', null)
      }

      if (media.product.owner_id !== user.id) {
        return formatErrorResponse('Sin permisos', null)
      }

      // Eliminar del storage si es upload personalizado
      if (media.url?.includes('user-uploads')) {
        const filename = media.url.split('/').pop()
        if (filename) {
          await storage.deleteFile(`products/${filename}`, 'user-uploads')
        }
      }

      await deleteProductMedia(mediaId)
      revalidatePath('/products')

      return formatSuccessResponse('Media eliminado', { mediaId })
    }

    // 4. CASO: Eliminar avatar/banner de usuario
    if (type === UPLOAD_TYPES.AVATAR || type === UPLOAD_TYPES.BANNER) {
      const userData = await getUserMediaByType(user.id, type)

      if (!userData) {
        return formatErrorResponse('Usuario no encontrado', null)
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

    return formatErrorResponse('Tipo de eliminación no válido', null)
  })
}