"use server"

import { createServerSideClient } from "@/utils/supabase/server"

export async function uploadProductImageAction(file: File, storeId: number) {
  const supabase = createServerSideClient()

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_")
  const filePath = `${storeId}/store-${storeId}-${Date.now()}-${sanitizedName}`

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      upsert: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(data.path)

  return {
    url: publicUrlData.publicUrl,
    path: data.path,
    type: "IMAGE" as const,
  }
}


