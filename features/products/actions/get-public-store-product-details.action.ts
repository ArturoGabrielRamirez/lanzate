"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectProductByIdAndSubdomain } from "@/features/products/data/select-product-by-id-and-subdomain.data"
import { selectProductByIdsAndSubdomain } from "@/features/products/data/select-product-by-ids-and-subdomain.data"

export async function getPublicStoreProductDetailsAction(productId: string, subdomain: string, variantId?: string) {
    return actionWrapper(async () => {
        const parsedProductId = parseInt(productId)
        const parsedVariantId = variantId ? parseInt(variantId) : undefined

        if (isNaN(parsedProductId)) throw new Error("Invalid product id")

        const { payload: product, hasError, message } = parsedVariantId
            ? await selectProductByIdsAndSubdomain(parsedProductId, parsedVariantId, subdomain)
            : await selectProductByIdAndSubdomain(parsedProductId, subdomain)

        if (hasError) throw new Error(message)

        return {
            payload: product,
            hasError: false,
            message: "Product details fetched successfully"
        }

    })
} 