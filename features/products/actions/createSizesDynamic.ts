"use server"

import { insertSizes } from "@/features/products/data/insertSizes"
import { actionWrapper } from "@/utils/lib"

export async function createSizesDynamic(label: string, store_id: number) {
  return actionWrapper(async () => {

    const { payload, error, message } = await insertSizes({ label, store_id })

    return { payload, error, message }

  })
}


