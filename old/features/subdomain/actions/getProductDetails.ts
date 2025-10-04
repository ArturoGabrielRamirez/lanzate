"use server"

import { formatErrorResponse } from "@/utils/lib"
import { selectProductByIdAndSubdomain } from "../data/selectProductByIdAndSubdomain"
import { selectProductByIdsAndSubdomain } from "../data/selectProductByIdsAndSubdomain"
import { GetProductDetailsReturn } from "../types/types"

export async function getProductDetails(productId: string, subdomain: string, variantId?: string): Promise<GetProductDetailsReturn> {
    try {
        const parsedProductId = parseInt(productId)
        const parsedVariantId = variantId ? parseInt(variantId) : undefined

        if (isNaN(parsedProductId)) throw new Error("Invalid product id")

        const { payload: product, error, message } = parsedVariantId
            ? await selectProductByIdsAndSubdomain(parsedProductId, parsedVariantId, subdomain)
            : await selectProductByIdAndSubdomain(parsedProductId, subdomain)

        if (error) throw new Error(message)

        return {
            payload: product,
            error: false,
            message: "Product details fetched successfully"
        }

    } catch (error) {
        return formatErrorResponse("Error fetching product details", error, null)
    }
} 