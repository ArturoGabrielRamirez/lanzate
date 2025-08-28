"use server"

import { actionWrapper } from "@/utils/lib"
import { insertUnifiedProduct } from "@/features/products/data/insertUnifiedProduct"

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

export async function createUnifiedProduct(args: CreateUnifiedProductArgs) {
    return actionWrapper(async () => {
        const { payload, error, message } = await insertUnifiedProduct(args)
        if (error) throw new Error(message)
        return { error: false, message: "Product created successfully", payload }
    })
}


