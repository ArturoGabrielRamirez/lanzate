'use server'

import { getCurrentUserWithIdAndEmailAction } from '@/features/auth/actions'
import { getUserId } from '@/features/auth/data/get-user-id'
import { GetUserUploadsParams, GetUserUploadsResponse } from '@/features/global/types/media'
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from '@/features/global/utils'
import { getStoragePath } from "@/features/global/utils/media/get-storege-path"
import { createServerSideClient } from '@/utils/supabase/server'

export async function getUserUploadsAction({ type }: GetUserUploadsParams) {
    return actionWrapper<GetUserUploadsResponse>(async () => {
        const currentUserResponse = await getCurrentUserWithIdAndEmailAction()
        if (!currentUserResponse || currentUserResponse.hasError) {
            return formatErrorResponse('Por favor, iniciá sesión para poder ver tus uploads')
        }

        const user = await getUserId({ payload: { id: currentUserResponse.payload?.id }, error: currentUserResponse.message })
        const supabase = createServerSideClient()

        // Determinar el bucket correcto
        const { bucket } = getStoragePath(type)

        // Listar archivos desde la raíz del bucket
        const { data: files } = await supabase.storage
            .from(bucket)
            .list('', { // String vacío = Raíz del bucket
                limit: 50,
                sortBy: { column: 'created_at', order: 'desc' }
            })

        if (!files?.length) {
            return formatSuccessResponse('No hay archivos', {
                uploads: [],
                count: 0
            })
        }

        // Filtrar archivos que pertenezcan al usuario
        // Formato esperado: type-userId-timestamp
        const regex = new RegExp(`^${type}-${user.id}-\\d+`, 'i')
        const userFiles = files.filter(file => regex.test(file.name))

        const uploads = userFiles.map(file => {
            const { data: publicUrlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(file.name) // Nombre directo, sin folder

            return publicUrlData.publicUrl
        }).filter(Boolean)

        return formatSuccessResponse('Archivos de usuario obtenidos exitosamente', {
            uploads,
            count: uploads.length
        })
    })
}