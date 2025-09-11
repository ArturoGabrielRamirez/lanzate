"use server"

import { insertMaterial } from "@/features/products/data/insertMaterial"

export async function createMaterialDynamic(payload: { label: string; image_url?: string }) {
  return insertMaterial(payload)
}


