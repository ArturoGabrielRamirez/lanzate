"use server"

import { revalidatePath } from "next/cache"
import { insertStore } from "../data/insertStore"
import { formatErrorResponse } from "@/utils/lib"
export async function createStore(name: string, userId: number) {
    try {

        const { payload, error, message } = await insertStore(name, userId)

        if (error) throw new Error(message)

        revalidatePath("/stores")

        return {
            message: "Store created successfully",
            payload: payload,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error creating store", error, null)
    }
}
