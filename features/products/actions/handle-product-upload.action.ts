"use server"
import { revalidatePath } from 'next/cache'

import { StorageService } from "@/features/global/services/storage"
import { FileUploadData, UploadResult } from "@/features/global/types/media"
import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import {
    createProductMediaData,
    /*     deleteProductMediaData, 
        updateProductPrimaryImageData,  */
    verifyProductOwnershipData,
    setMediaAsPrimaryData // ✅ Nueva función
} from "@/features/products/data"

export async function handleProductUploadAction(
    uploadData: FileUploadData,
    userId: number,
    username: string,
    storage: StorageService,
    isPrimary: boolean = false,
    sortOrder: number = 0
) {
    return actionWrapper(async () => {
        const { file, type, productId, variantId } = uploadData

        if (!productId) {
            throw new Error('productId es requerido para subir media de productos')
        }

        console.log('📦 handleProductUploadAction:', {
            productId,
            type,
            fileName: file.name,
            isPrimary,
            sortOrder
        })

        const product = await verifyProductOwnershipData(productId, userId)
        if (!product) {
            throw new Error('Producto no encontrado o sin permisos')
        }

        // ✅ Subir archivo al storage
        const publicUrl = await storage.uploadFile(file, type, userId)
        console.log('☁️ File uploaded to storage:', publicUrl)

        // ✅ Crear registro en ProductMedia con sort_order
        const mediaRecord = await createProductMediaData(
            productId,
            variantId,
            publicUrl,
            file,
            type,
            sortOrder
        )
        console.log('💾 Media record created:', mediaRecord)

        // ✅ Si es imagen y debe ser principal, actualizarla
        if (mediaRecord.type === 'IMAGE' && isPrimary) {
            console.log('⭐ Setting as primary image')

            await setMediaAsPrimaryData(productId, variantId, mediaRecord.id)

            /*       await updateProductPrimaryImageData(
                      productId,
                      publicUrl,
                      mediaRecord.id
                  ) */

            console.log('✅ Primary image updated')
        }

        // Revalidar rutas
        revalidatePath(`/stores/*/products/${productId}`)
        revalidatePath(`/stores/*/products`)

        const result: UploadResult = {
            message: `${type} subido correctamente`,
            url: publicUrl,
            filename: file.name,
            originalSize: file.size,
            username,
            media: mediaRecord,
            type
        }

        return formatSuccessResponse(result.message, result)
    })
}