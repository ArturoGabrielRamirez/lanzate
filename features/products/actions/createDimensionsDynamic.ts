"use server"

import { insertDimensions } from "@/features/products/data/insertDimensions"
import { actionWrapper } from "@/utils/lib"

export async function createDimensionsDynamic(label: string, store_id: number, value?: number, unit?: string) {
  return actionWrapper(async () => {

    const { payload, error, message } = await insertDimensions({ label, value, unit, store_id })

    return { payload, error, message }

  })

}


