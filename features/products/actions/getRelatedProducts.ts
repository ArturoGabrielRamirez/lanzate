"use server"

import { formatErrorResponse } from "@/utils/lib"
import { selectRelatedProducts } from "../data/selectRelatedProducts"

export async function getRelatedProducts(productId: number) {
  try {
    const { payload, error, message } = await selectRelatedProducts(productId)
    if (error) throw new Error(message)
    return { payload, error: false, message }
  } catch (error) {
    return formatErrorResponse("Error fetching related products", error, { sameProductVariants: [], categoryProducts: [] })
  }
}


