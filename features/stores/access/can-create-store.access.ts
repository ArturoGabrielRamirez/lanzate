"use server"

import { getUserById } from "@/features/layout/data/getUserById"
import { getStoresFromUser } from "@/features/stores/data/get-stores-from-user.data"

export async function canCreateStore(userId: number) {
    try {
        const { payload: user, error: userError } = await getUserById(userId)

        if (userError || !user) {
            return false
        }

        const { payload: stores, error: storesError } = await getStoresFromUser(userId)

        if (storesError) {
            return false
        }

        if (stores.length >= 2 && user.Account[0].type === "FREE") {
            return false
        }

        return true
    } catch (error) {
        console.error("Error in canCreateStore:", error)
        return false
    }
}
