'use server'

import { SupabaseClient } from "@supabase/supabase-js"

export async function getStorageBannersData(
    supabase: SupabaseClient,
    userId: number
) {
    const { data: files } = await supabase.storage
        .from('user-uploads')
        .list('banners', {
            limit: 50,
            sortBy: { column: 'updated_at', order: 'desc' }
        })

    if (!files?.length) return []

    // Filtro estricto: solo archivos en formato banner-<userId>-<timestamp>
    const regex = new RegExp(`^banner-${userId}-\\d+`, 'i')
    const userFiles = files.filter(file => regex.test(file.name))

    console.log(
        `Usuario ${userId} tiene ${userFiles.length} banners personalizados de ${files.length} archivos totales`
    )

    const banners = []
    for (const file of userFiles) {
        const { data: publicUrlData } = supabase.storage
            .from('user-uploads')
            .getPublicUrl(`banners/${file.name}`)

        if (publicUrlData?.publicUrl) {
            banners.push({
                url: publicUrlData.publicUrl,
                fileName: file.name,
                size: file.metadata?.size,
                uploadedAt: file.updated_at || file.created_at
            })
        }
    }

    return banners
}