"use server"

import { insertFlavor } from "@/features/products/data/insertFlavor"
import { actionWrapper } from "@/utils/lib"

export async function createFlavorDynamic(label: string, store_id: number) {
  return actionWrapper(async () => {

    const { payload, error, message } = await insertFlavor({ label, store_id })

    if (error) throw new Error(message)

    return { payload, error, message }
  })
}


