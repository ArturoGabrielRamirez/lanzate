"use server"

import { getUserById } from "@/features/global/data/getUserById"
import { getStoresFromUserData } from "@/features/stores/data"

export async function canCreateStore(userId: number) {
    try {
        const { payload: user, hasError: userError } = await getUserById(userId)

        if (userError || !user) {
            return false
        }

        const { payload: stores, hasError: storesError } = await getStoresFromUserData(userId)

        if (storesError) {
            return false
        }

        if (stores.length >= 2 && user.Account[0].type === "FREE") {
            return false
        }

        return true
    } catch (error) {
        return false
    }
}