"use server"

import { insertFragrance } from "@/features/products/data/insertFragrance"

export async function createFragranceDynamic(label: string) {
  return insertFragrance({ label })
}


