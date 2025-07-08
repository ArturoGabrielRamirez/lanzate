"use server"

import { formatErrorResponse } from "@/utils/lib"
import { insertProduct } from "../data/insertProduct"
import { revalidatePath } from "next/cache"

export async function createProduct(payload: any, storeId: number) {
    try {

        const { error, message, payload: product } = await insertProduct(payload, storeId)

        if (error) throw new Error(message)

        revalidatePath(`/stores/${storeId}`)

        return {
            error: false,
            message: "Product created successfully",
            payload: product
        }

    } catch (error) {
        return formatErrorResponse("Error creating product", error, null)
    }
}
