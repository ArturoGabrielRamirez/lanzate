"use server"

import { formatErrorResponse } from "@/utils/lib"
import { canUpdateStore } from "../access/canUpdateStore"
import { updateStoreBySlug } from "../data/updateStoreBySlug"
import { revalidatePath } from "next/cache"

export async function updateStore(slug: string, data: any, userId: number) {
    try {

        const canUpdate = await canUpdateStore(slug, userId)

        if (!canUpdate) throw new Error("You are not allowed to update this store")

        const { error, payload, message } = await updateStoreBySlug(slug, data)

        if (error) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

        return {
            message: "Store updated successfully",
            payload: payload,
            error: false
        }
    } catch (error) {
        return formatErrorResponse("Error updating store", error, null)
    }
}
