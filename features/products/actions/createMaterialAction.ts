"use server"

import { actionWrapper } from "@/utils/lib"
import { createServerSideClient } from "@/utils/supabase/server"

export async function createMaterialAction(file: File, storeId: number) {
    return actionWrapper(async () => {
        const supabase = createServerSideClient()

        const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_")
        const filePath = `${storeId}/store-${storeId}-${Date.now()}-${sanitizedName}`

        const { data, error } = await supabase.storage
            .from("product_materials")
            .upload(filePath, file, {
                upsert: false,
            })

        if (error) {
            throw new Error(error.message)
        }

        const { data: publicUrlData } = supabase.storage
            .from("product_materials")
            .getPublicUrl(data.path)

        return {
            error: false,
            message: "Material created successfully",
            payload: {
                url: publicUrlData.publicUrl,
                path: data.path,
                type: "MATERIAL" as const,
            }
        }
    })
}
