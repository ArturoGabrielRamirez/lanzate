"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectRelatedProductsData } from "@/features/products/data/select-related-products.data"

export async function getRelatedProductsAction(productId: number) {
  return actionWrapper(async () => {
    const { payload, error, message } = await selectRelatedProductsData(productId)
    if (error) throw new Error(message)
    return { payload, hasError: false, message }
  })
}


