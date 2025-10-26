"use server"

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { updateStoreBanner, updateStoreLogo, verifyStoreOwnership } from "@/features/shared/data"
import { StorageService } from "@/features/shared/services/storage"
import { FileUploadData, UPLOAD_TYPES, UploadResult } from "@/features/shared/types"

export async function handleStoreUploadAction(
    uploadData: FileUploadData,
    userId: number,
    username: string,
    storage: StorageService
) {
    return actionWrapper(async () => {
        const { file, type, storeId } = uploadData

        if (!storeId) {
            throw new Error('storeId es requerido para subir archivos de tiendas')
        }

        const store = await verifyStoreOwnership(storeId, userId)

        if (!store) {
            throw new Error('Tienda no encontrada o sin permisos')
        }

        // Obtener la URL antigua antes de subir la nueva
        const oldUrl = type === UPLOAD_TYPES.STORE_BANNER ? store.banner : store.logo
        const bucket = type === UPLOAD_TYPES.STORE_BANNER ? 'store-banners' : 'store-logos'

        // Subir nuevo archivo
        const publicUrl = await storage.uploadFile(file, type, userId)

        // Eliminar archivo antiguo del storage si existe
        if (oldUrl && oldUrl.includes('.supabase.')) {
            console.log(`Eliminando ${type} antiguo de la tienda:`, oldUrl)
            await storage.deleteFile(oldUrl, bucket)
            console.log(`${type} antiguo eliminado correctamente`)
        }

        // Actualizar en la base de datos
        const updatedStore = type === UPLOAD_TYPES.STORE_BANNER
            ? await updateStoreBanner(storeId, publicUrl)
            : await updateStoreLogo(storeId, publicUrl)

        const result: UploadResult = {
            message: `${type} subido correctamente`,
            url: publicUrl,
            filename: file.name,
            originalSize: file.size,
            username,
            store: updatedStore,
            type
        }

        return formatSuccessResponse(result.message, result)
    })
}