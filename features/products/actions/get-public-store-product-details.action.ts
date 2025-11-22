"use server"

import { actionWrapper } from "@/features/global/utils"
import { selectProductByIdAndSubdomainData } from "@/features/products/data/select-product-by-id-and-subdomain.data"
import { selectProductByIdsAndSubdomainData } from "@/features/products/data/select-product-by-ids-and-subdomain.data"

export async function getPublicStoreProductDetailsAction(productId: string, subdomain: string, variantId?: string) {
    return actionWrapper(async () => {
        const parsedProductId = parseInt(productId)
        const parsedVariantId = variantId ? parseInt(variantId) : undefined

        if (isNaN(parsedProductId)) throw new Error("ID de producto inválido")

        const { payload: product, hasError, message } = parsedVariantId
            ? await selectProductByIdsAndSubdomainData(parsedProductId, parsedVariantId, subdomain)
            : await selectProductByIdAndSubdomainData(parsedProductId, subdomain)

        if (hasError) throw new Error(message)

        return {
            payload: product,
            hasError: false,
            message: "Detalles del producto obtenidos exitosamente"
        }

    })
} 