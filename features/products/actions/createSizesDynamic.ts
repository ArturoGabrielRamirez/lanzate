"use server"

import { insertSizes } from "@/features/products/data/insertSizes"

export async function createSizesDynamic(label: string) {
  return insertSizes({ label })
}


