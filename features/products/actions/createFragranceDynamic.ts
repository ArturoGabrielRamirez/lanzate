"use server"

import { insertFragrance } from "@/features/products/data/insertFragrance"
import { actionWrapper } from "@/utils/lib"

export async function createFragranceDynamic(label: string, store_id: number) {
  return actionWrapper(async () => {

    const { payload, error, message } = await insertFragrance({ label, store_id })

    if (error) throw new Error(message)

    return { payload, error, message }
  })
}
