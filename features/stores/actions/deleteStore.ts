"use server"

import { formatErrorResponse } from "@/utils/lib"
import { deleteStore as deleteStoreFromDb } from "../data/deleteStore"
import { revalidatePath } from "next/cache"

export async function deleteStore(storeId: number) {
    try {

        const { error, message, payload } = await deleteStoreFromDb(storeId)


        if (error) throw new Error(message)

        revalidatePath("/stores")

        return {
            error: false,
            message: "Store deleted successfully",
            payload: payload
        }

    } catch (error) {
        return formatErrorResponse("Error deleting store", error, null)
    }
}
