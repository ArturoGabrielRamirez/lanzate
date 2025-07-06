"use server"

import { revalidatePath } from "next/cache"
import { insertStore } from "../data/insertStore"
import { formatErrorResponse } from "@/utils/lib"
import { getUserById } from "@/features/layout/data/getUserById"
import { getStoresFromUser } from "../data/getStoresFromUser"

export async function createStore(name: string, userId: number) {
    try {

        const { payload: user, error: userError, message: userMessage } = await getUserById(userId)

        if (userError || !user) {
            throw new Error(userMessage)
        }

        const { payload: stores, error: storesError, message: storesMessage } = await getStoresFromUser(userId)

        if (storesError) {
            throw new Error(storesMessage)
        }

        if (stores.length >= 2 && user.Account[0].type === "FREE") {
            throw new Error("Free plan limit reached")
        }

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
