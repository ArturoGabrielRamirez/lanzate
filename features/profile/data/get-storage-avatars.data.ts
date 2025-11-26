'use server'

import { SupabaseClient } from "@supabase/supabase-js"

export async function getStorageAvatarsData(
    supabase: SupabaseClient,
    userId: number
) {
    const { data: files } = await supabase.storage
        .from('avatars')
        .list('', {
            limit: 50,
            sortBy: { column: 'updated_at', order: 'desc' }
        })

    if (!files?.length) return []

    const regex = new RegExp(`^avatar-${userId}-\\d+`, 'i')
    const userFiles = files.filter(file => regex.test(file.name))

    const avatars = []
    for (const file of userFiles) {
        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(file.name)

        if (publicUrlData?.publicUrl) {
            avatars.push({
                url: publicUrlData.publicUrl,
                fileName: file.name,
                size: file.metadata?.size,
                uploadedAt: file.updated_at || file.created_at
            })
        }
    }

    return avatars
}