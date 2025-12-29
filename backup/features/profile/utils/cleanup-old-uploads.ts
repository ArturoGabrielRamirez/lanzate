"use server"

import { SupabaseClient } from "@supabase/supabase-js"

export async function cleanupOldUploads(supabase: SupabaseClient, userId: string, type: string) {
    try {
        const { data: files } = await supabase.storage
            .from('store-banners')
            .list('', { search: `${userId}-${type}`, sortBy: { column: 'updated_at', order: 'desc' } })

        if (!files) return

        const filesToDelete = files.slice(5)
        if (filesToDelete.length > 0) {
            const pathsToDelete = filesToDelete.map((f: { name: string }) => f.name)
            await supabase.storage.from('store-banners').remove(pathsToDelete)
        }
    } catch (err) {
        console.error('Error limpiando uploads antiguos:', err)
    }
}