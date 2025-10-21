"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { insertUnifiedProduct } from "@/features/products/data/insert-unified-product.data"

export type CreateUnifiedProductArgs = {
    form: {
        name: string
        slug?: string
        description?: string
        price: number
        stock: number
        categories: { label: string; value: string }[]
        images?: File[]
        [key: string]: unknown
    }
    media?: { files: File[]; primaryIndex: number | null }
    categories?: { categories: { label: string; value: string }[] }
    sizes?: { isUniqueSize: boolean; sizes: { label: string; value: string }[]; measures?: { label: string; value: string; group?: string }[] }
    colors?: { colors: { id: string; name: string; rgba: [number, number, number, number] }[] }
    dimensions?: { [key: string]: unknown }
    settings?: { isActive: boolean; isFeatured: boolean; isPublished: boolean }
    variants?: { id: string; sizeOrMeasure?: string; color?: { id: string; name: string; rgba: [number, number, number, number] } }[]
    targetStoreId: number
    userId: number
}

export async function createUnifiedProductAction(args: CreateUnifiedProductArgs) {
    return actionWrapper(async () => {
        const { payload, error, message } = await insertUnifiedProduct(args)
        if (error) throw new Error(message)

        revalidatePath("/store/" + args.targetStoreId)
        
        return { hasError: false, message: "Product created successfully", payload }
    })
}


