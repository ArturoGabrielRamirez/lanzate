"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { insertUnifiedProduct } from "@/features/products/data/insert-unified-product.data"
import { CreateUnifiedProductArgs } from "@/features/products/types"

export async function createUnifiedProductAction(args: CreateUnifiedProductArgs) {
    return actionWrapper(async () => {
        const { payload, hasError, message } = await insertUnifiedProduct(args)
        if (hasError) throw new Error(message)

        revalidatePath("/store/" + args.targetStoreId)
        
        return { hasError: false, message: "Product created successfully", payload }
    })
}


