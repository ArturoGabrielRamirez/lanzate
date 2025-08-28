"use server"

import { actionWrapper } from "@/utils/lib"
import { deleteProductVariant as deleteVariantFromDb } from "@/features/products/data/deleteProductVariant"
import { revalidatePath } from "next/cache"

export async function deleteProductVariant(variantId: number, slug: string) {
    return actionWrapper(async () => {
        const { payload, error, message } = await deleteVariantFromDb(variantId)
        if (error) throw new Error(message)
        revalidatePath(`/stores/${slug}`)
        return { error: false, message: "Variant deleted successfully", payload }
    })
}


