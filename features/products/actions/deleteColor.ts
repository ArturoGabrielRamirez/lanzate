"use server"

import { actionWrapper } from "@/utils/lib"
import { deleteColor as deleteColorFromDb } from "@/features/products/data/deleteColor"

export async function deleteColor(colorHex: string, storeId: number) {
    return actionWrapper(async () => {

        const { error, message, payload } = await deleteColorFromDb(colorHex, storeId)

        if (error) throw new Error(message)

        return { error: false, message: "Color deleted successfully", payload }
    })
}
