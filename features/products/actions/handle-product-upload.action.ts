"use server"

import { StorageService } from "@/features/global/services/storage"
import { FileUploadData, UploadResult } from "@/features/global/types/media"
import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { createProductMediaData, deleteProductMediaData, updateProductPrimaryImageData, verifyProductOwnershipData } from "@/features/products/data"

export async function handleProductUploadAction(
    uploadData: FileUploadData,
    userId: number,
    username: string,
    storage: StorageService
) {
    return actionWrapper(async () => {
        const { file, type, productId } = uploadData

        if (!productId) {
            throw new Error('productId es requerido para subir media de productos')
        }

        const product = await verifyProductOwnershipData(productId, userId)

        if (!product) {
            throw new Error('Producto no encontrado o sin permisos')
        }

        // Si es una imagen y el producto ya tiene una imagen principal, eliminar la antigua
        if (type === 'product-image' && product.image && product.primary_media_id) {
            console.log('Eliminando imagen principal antigua:', product.image)

            // Eliminar archivo físico del storage
            await storage.deleteFile(product.image, 'product-images')

            // Eliminar registro de la base de datos
            await deleteProductMediaData(product.primary_media_id)

            console.log('Imagen principal antigua eliminada correctamente')
        }

        const publicUrl = await storage.uploadFile(file, type, userId)

        const mediaRecord = await createProductMediaData(
            productId,
            publicUrl,
            file,
            type
        )

        // Verificar si es imagen basándonos en el tipo del registro creado
        if (mediaRecord.type === 'IMAGE') {
            await updateProductPrimaryImageData(
                productId,
                publicUrl,
                mediaRecord.id
            )
            console.log('Imagen principal de producto actualizada')
        }

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