"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"
import { insertProduct } from "@/features/products/data/insert-product.data"

type CategoryValue = { value: string; label: string }

type InsertProductPayload = {
    name: string
    price: number
    stock: number
    description?: string
    categories: CategoryValue[]
    image?: File
    is_active?: boolean
    is_featured?: boolean
    is_published?: boolean
}

export async function createProductAction(payload: InsertProductPayload, storeId: number, userId: number) {
    return actionWrapper(async () => {


        const { error, message, payload: product } = await insertProduct(payload, storeId, userId)

        if (error) throw new Error(message)

        revalidatePath(`/stores/${storeId}`)
        revalidatePath(`/dashboard`)

        const { error: logError } = await insertLogEntry({
            action: "CREATE",
            entity_type: "PRODUCT",
            entity_id: product.id,
            user_id: userId,
            action_initiator: "Create product button",
            details: "Product created using the create product button"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")


        return {
            hasError: false,
            message: "Product created successfully",
            payload: product
        }

    })
}
