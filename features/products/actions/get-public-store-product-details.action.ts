"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectProductByIdAndSubdomain } from "@/features/products/data/selectProductByIdAndSubdomain"
import { selectProductByIdsAndSubdomain } from "@/features/products/data/selectProductByIdsAndSubdomain"

export async function getPublicStoreProductDetailsAction(productId: string, subdomain: string, variantId?: string) {
    return actionWrapper(async () => {
        const parsedProductId = parseInt(productId)
        const parsedVariantId = variantId ? parseInt(variantId) : undefined

        if (isNaN(parsedProductId)) throw new Error("Invalid product id")

        const { payload: product, error, message } = parsedVariantId
            ? await selectProductByIdsAndSubdomain(parsedProductId, parsedVariantId, subdomain)
            : await selectProductByIdAndSubdomain(parsedProductId, subdomain)

        if (error) throw new Error(message)

        return {
            payload: product,
            hasError: false,
            message: "Product details fetched successfully"
        }

    })
} 