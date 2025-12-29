"use server"

import { revalidatePath } from "next/cache"

import { createStorageService } from "@/features/global/services/storage"
import { UPLOAD_TYPES, DeleteResult } from "@/features/global/types/media"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/features/global/utils"
import { getStoragePath } from "@/features/global/utils/media/get-storege-path"
import { prisma } from "@/utils/prisma"

export async function handleStoreDeleteAction(
  type: typeof UPLOAD_TYPES.STORE_LOGO | typeof UPLOAD_TYPES.STORE_BANNER,
  storeId: number,
  _userId: number,
) {
  return actionWrapper<DeleteResult>(async () => {
    // 1. Obtener la tienda para saber qué archivo borrar
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        banner: true,
        user_id: true
      }
    })
     
    if (!store) {
      return formatErrorResponse('Tienda no encontrada')
    }

    // 2. Verificar permisos (Descomentar si es necesario validar owner aquí)
    // if (store.user_id !== userId) {
    //   return formatErrorResponse('Sin permisos para modificar esta tienda')
    // }

    // 3. Determinar el campo en la BD y el bucket en Storage
    const field = type === UPLOAD_TYPES.STORE_LOGO ? 'logo' : 'banner'
    const currentUrl = store[field]
    
    // Obtenemos el bucket correcto (ej: 'store-logos' o 'store-banners')
    const { bucket } = getStoragePath(type)

    // 4. Eliminar del storage si existe URL y coincide con el bucket actual
    if (currentUrl?.includes(bucket)) {
      const storage = createStorageService()
      
      try {
        // Al estar en la raíz del bucket, el nombre del archivo es la última parte de la URL
        const filename = currentUrl.split('/').pop()
        
        if (filename) {
          // Borramos del bucket específico
          await storage.deleteFile(filename, bucket)
        }
      } catch (error) {
        console.error(`Error eliminando ${field} del bucket ${bucket}:`, error)
        // No bloqueamos el flujo: aunque falle el storage, queremos limpiar la BD
      }
    }

    // 5. Actualizar BD (setear el campo a null)
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        [field]: null,
        updated_at: new Date()
      },
      select: {
        id: true,
        name: true,
        logo: true,
        banner: true,
        slug: true
      }
    })

    // 6. Revalidar rutas afectadas
    revalidatePath(`/stores/${store.slug}`)
    revalidatePath('/dashboard/stores')

    const mediaType = field === 'logo' ? 'Logo' : 'Banner'
     
    return formatSuccessResponse(
      `${mediaType} de tienda eliminado correctamente`,
      {
        message: `${mediaType} eliminado`,
        store: updatedStore
      }
    )
  })
}