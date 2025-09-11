"use server"

import { insertColor } from "@/features/products/data/insertColor"

export async function createColorDynamic(payload: { name?: string; hex?: string }) {
  return insertColor(payload)
}


