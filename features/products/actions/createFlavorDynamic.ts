"use server"

import { insertFlavor } from "@/features/products/data/insertFlavor"

export async function createFlavorDynamic(label: string) {
  return insertFlavor({ label })
}


