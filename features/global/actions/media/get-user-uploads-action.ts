'use server'

import { getCurrentUserWithIdAndEmailAction } from '@/features/auth/actions'
import { getUserId } from '@/features/auth/data/get-user-id'
import { GetUserUploadsParams, GetUserUploadsResponse } from '@/features/global/types/media'
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from '@/features/global/utils'
import { createServerSideClient } from '@/utils/supabase/server'

export async function getUserUploadsAction({ type }: GetUserUploadsParams) {
    return actionWrapper<GetUserUploadsResponse>(async () => {
        const currentUserResponse = await getCurrentUserWithIdAndEmailAction()
        if (!currentUserResponse || currentUserResponse.hasError) {
            return formatErrorResponse('Por favor, iniciá sesión para poder ver tus uploads')
        }

        const user = await getUserId({ payload: { id: currentUserResponse.payload?.id }, error: currentUserResponse.message })

        const supabase = createServerSideClient()

        const folder = type === 'avatar' ? 'avatars' : 'banners'

        const { data: files } = await supabase.storage
            .from('user-uploads')
            .list(folder, {
                limit: 50,
                sortBy: { column: 'created_at', order: 'desc' }
            })

        if (!files?.length) {
            return formatSuccessResponse('No hay archivos', {
                uploads: [],
                count: 0
            })
        }

        const regex = new RegExp(`^${type}-${user.id}-\\d+`, 'i')
        const userFiles = files.filter(file => regex.test(file.name))

        const uploads = userFiles.map(file => {
            const { data: publicUrlData } = supabase.storage
                .from('user-uploads')
                .getPublicUrl(`${folder}/${file.name}`)

            return publicUrlData.publicUrl
        }).filter(Boolean)

        return formatSuccessResponse('Archivos de usuario obtenidos exitosamente', {
            uploads,
            count: uploads.length
        })
    })
}