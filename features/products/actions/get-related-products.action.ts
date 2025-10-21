"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectRelatedProducts } from "@/features/products/data/selectRelatedProducts"

export async function getRelatedProductsAction(productId: number) {
  return actionWrapper(async () => {
    const { payload, error, message } = await selectRelatedProducts(productId)
    if (error) throw new Error(message)
    return { payload, hasError: false, message }
  })
}


