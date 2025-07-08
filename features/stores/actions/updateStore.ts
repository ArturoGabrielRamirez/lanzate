"use server"

import { formatErrorResponse } from "@/utils/lib"
import { canUpdateStore } from "../access/canUpdateStore"
import { updateStoreBySlug } from "../data/updateStoreBySlug"

export async function updateStore(slug: string, data: any, userId: number) {
    try {

        const canUpdate = await canUpdateStore(slug, userId)

        if (!canUpdate) throw new Error("You are not allowed to update this store")

        const updatedStore = await updateStoreBySlug(slug, data)

        return {
            message: "Store updated successfully",
            payload: data,
            error: false
        }
    } catch (error) {
        return formatErrorResponse("Error updating store", error, null)
    }
}
