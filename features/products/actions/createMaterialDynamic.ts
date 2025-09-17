"use server"

import { actionWrapper } from "@/utils/lib"
import { insertMaterial } from "@/features/products/data/insertMaterial"

export async function createMaterialDynamic(payload: { label: string; image_url?: string, store_id: number }) {
  return actionWrapper(async () => {
    const { payload: material, error, message } = await insertMaterial(payload)

    if (error) throw new Error(message)

    return { payload: material, error, message }
  })
}


