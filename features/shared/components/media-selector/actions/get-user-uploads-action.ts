'use server'

import { actionWrapper, formatErrorResponse, formatSuccessResponse } from '@/utils/lib'
import { getCurrentUser } from '@/features/auth/actions'
import { getUserId } from '@/features/shared/data/get-user-id'
import { createServerSideClient } from '@/utils/supabase/server'
import { GetUserUploadsParams } from '../types'

export async function getUserUploadsAction({ type }: GetUserUploadsParams) {
    return actionWrapper(async () => {
        const currentUserResponse = await getCurrentUser()
        if (!currentUserResponse || currentUserResponse.error) {
            return formatErrorResponse('Debes iniciar sesión', null)
        }

        const user = await getUserId({
            ...currentUserResponse,
            error: currentUserResponse.message
        })

        const supabase = createServerSideClient()

        const folder = type === 'avatar' ? 'avatars' : 'banners'

        const { data: files } = await supabase.storage
            .from('user-uploads')
            .list(folder, {
                limit: 50,
                sortBy: { column: 'created_at', order: 'desc' }
            })

        if (!files?.length) {
            return formatSuccessResponse('No hay uploads', { uploads: [] })
        }

        const regex = new RegExp(`^${type}-${user.id}-\\d+`, 'i')
        const userFiles = files.filter(file => regex.test(file.name))

        const uploads = userFiles.map(file => {
            const { data: publicUrlData } = supabase.storage
                .from('user-uploads')
                .getPublicUrl(`${folder}/${file.name}`)

            return publicUrlData.publicUrl
        }).filter(Boolean)

        return formatSuccessResponse('Uploads obtenidos', {
            uploads,
            count: uploads.length
        })
    })
}