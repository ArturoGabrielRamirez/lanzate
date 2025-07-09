"use server"

import { revalidatePath } from "next/cache"
import { insertStore } from "../data/insertStore"
import { formatErrorResponse } from "@/utils/lib"
import { canCreateStore } from "../access/canCreateStore"

export async function createStore(payload: any, userId: number) {
    try {

        const canCreate = await canCreateStore(userId)

        if (!canCreate) throw new Error("Free plan limit reached")

        const { payload : newStore, error, message } = await insertStore(payload, userId)

        if (error) throw new Error(message)

        revalidatePath("/stores")

        return {
            message: "Store created successfully",
            payload: newStore,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error creating store", error, null)
    }
}
