"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { deleteProductVariantData as deleteVariantFromDb } from "@/features/products/data/delete-product-variant.data"

export async function deleteProductVariantAction(variantId: number, slug: string) {
    return actionWrapper(async () => {
        const { payload, hasError, message } = await deleteVariantFromDb(variantId)
        if (hasError) throw new Error(message)
        revalidatePath(`/stores/${slug}`)
        return { hasError: false, message: "Variant soft deleted successfully", payload }
    })
}


