import { createServerSideClient } from '@/utils/supabase/server'
import type { UploadType } from '../types/types'
import { getStoragePath } from '@/features/shared/utils/get-storege-path'
import { generateFileName } from '@/features/shared/utils/generate-file-name'
import { extractFilePathFromUrl } from '@/features/shared/utils/extract-file-path-from-url'

export class StorageService {
    private supabase: Awaited<ReturnType<typeof createServerSideClient>>

    constructor(supabase: Awaited<ReturnType<typeof createServerSideClient>>) {
        this.supabase = supabase
    }

    async uploadFile(file: File, type: UploadType, userId: number): Promise<string> {
        const fileExtension = file.name.split('.').pop() || 'jpg'
        const fileName = generateFileName(type, userId, fileExtension)
        const { bucket, folder } = getStoragePath(type)
        const filePath = folder ? `${folder}/${fileName}` : fileName

        const { data, error } = await this.supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                contentType: file.type,
                upsert: true,
                cacheControl: '3600'
            })

        if (error) {
            console.error('❌ Error Supabase Storage:', error)
            throw new Error(`Error subiendo archivo: ${error.message}`)
        }

        const { data: publicUrlData } = this.supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)

        if (!publicUrlData?.publicUrl) {
            throw new Error('No se pudo obtener la URL pública del archivo')
        }

        return publicUrlData.publicUrl
    }

    async deleteFile(url: string, bucket: string): Promise<void> {

        // Si la URL es solo un path relativo, construir la ruta completa
        let filePath: string | null = null

        if (url.includes('.supabase.')) {
            // Es una URL completa, extraer el path
            if (!url.includes(bucket)) {

                return
            }
            filePath = extractFilePathFromUrl(url, bucket)
        } else {
            // Es un path relativo, usarlo directamente
            filePath = url
        }

        console.log('🔍 filePath a eliminar:', filePath)

        if (filePath) {

            const { error } = await this.supabase.storage
                .from(bucket)
                .remove([filePath])

            if (error) {
                console.error('❌ Error eliminando archivo:', error)
                throw new Error(`Error eliminando archivo: ${error.message}`)
            }

        } else {
            console.warn('⚠️ No se pudo extraer filePath de la URL:', url)
        }
    }

    async deleteUserFile(url: string): Promise<void> {
        await this.deleteFile(url, 'user-uploads')
    }
}

export function createStorageService() {
    const supabase = createServerSideClient()
    return new StorageService(supabase)
}