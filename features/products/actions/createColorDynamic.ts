"use server"

import { insertColor } from "@/features/products/data/insertColor"
import { actionWrapper } from "@/utils/lib";

export async function createColorDynamic(payload: { name: string; value: string, store_id: number }) {

  return actionWrapper(async () => {

    const { payload: color, error, message } = await insertColor(payload)

    if (error) throw new Error(message)

    return { payload: color, error, message }

  })

}


