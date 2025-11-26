import { UploadType } from '@/features/global/types/media'
import { extractFilePathFromUrl } from '@/features/global/utils/media/extract-file-path-from-url'
import { generateFileName } from '@/features/global/utils/media/generate-file-name'
import { getStoragePath } from '@/features/global/utils/media/get-storege-path'
import { createServerSideClient } from '@/utils/supabase/server'

export class StorageService {
    private supabase: Awaited<ReturnType<typeof createServerSideClient>>

    constructor(supabase: Awaited<ReturnType<typeof createServerSideClient>>) {
        this.supabase = supabase
    }

    async uploadFile(file: File, type: UploadType, userId: number): Promise<string> {
        const fileExtension = file.name.split('.').pop() || 'jpg'
        const fileName = generateFileName(type, userId, fileExtension)
        
        // Obtenemos la configuración del bucket dinámicamente
        const { bucket/* , folder */ } = getStoragePath(type)
        
        // Si hay folder (casos legacy o específicos) lo usamos, si no, va a la raíz
  /*       const filePath = folder ? `${folder}/${fileName}` : fileName */

        const { error } = await this.supabase.storage
            .from(bucket)
            .upload(fileName, file, {
                contentType: file.type,
                upsert: true,
                cacheControl: '3600'
            })

        if (error) {
            console.error(`❌ Error Supabase Storage [${bucket}]:`, error)
            throw new Error(`Error subiendo archivo: ${error.message}`)
        }

        const { data: publicUrlData } = this.supabase.storage
            .from(bucket)
            .getPublicUrl(fileName)

        if (!publicUrlData?.publicUrl) {
            throw new Error('No se pudo obtener la URL pública del archivo')
        }

        return publicUrlData.publicUrl
    }

    async deleteFile(url: string, bucket: string): Promise<void> {
        let filePath: string | null = null

        if (url.includes('.supabase.')) {
            // Verificamos que la URL pertenezca al bucket que intentamos borrar
            if (!url.includes(bucket)) {
                console.warn(`⚠️ La URL no coincide con el bucket esperado: ${bucket}`)
                return
            }
            filePath = extractFilePathFromUrl(url, bucket)
        } else {
            filePath = url
        }

        console.log(`🔍 Eliminando de bucket '${bucket}': ${filePath}`)

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
}

export function createStorageService() {
    const supabase = createServerSideClient()
    return new StorageService(supabase)
}