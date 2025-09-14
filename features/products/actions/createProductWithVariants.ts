"use server"

import { actionWrapper } from "@/utils/lib"
import { insertProductWithVariants, InsertProductWithVariantsArgs } from "@/features/products/data/insertProductWithVariants"
import { revalidatePath } from "next/cache"

export async function createProductWithVariants(args: InsertProductWithVariantsArgs) {
  return actionWrapper(async () => {
    const { payload, error, message } = await insertProductWithVariants(args)
    if (error) throw new Error(message)
    revalidatePath(`/stores/${args.storeId}`)
    revalidatePath(`/dashboard`)
    return { payload, error: false, message: "Product created" }
  })
}


