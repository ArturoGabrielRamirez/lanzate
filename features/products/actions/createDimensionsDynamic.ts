"use server"

import { insertDimensions } from "@/features/products/data/insertDimensions"

export async function createDimensionsDynamic(label: string, value?: number, unit?: string) {
  return insertDimensions({ label, value, unit })
}


