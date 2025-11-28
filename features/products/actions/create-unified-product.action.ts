"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { insertUnifiedProductData } from "@/features/products/data/insert-unified-product.data"
import { CreateUnifiedProductArgs } from "@/features/products/types"

export async function createUnifiedProductAction(args: CreateUnifiedProductArgs) {

    return actionWrapper(async () => {

        const { payload, hasError, message } = await insertUnifiedProductData(args)

        if (hasError) throw new Error(message)

        revalidatePath("/store/" + args.targetStoreId)

        return { hasError: false, message: "Producto creado exitosamente", payload }
    })
}


