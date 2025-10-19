"use server"

import { getUserById } from "@/features/layout/data/getUserById"
import { selectStoreById } from "@/features/stores/data/selectStoreById"

export async function canDeleteStoreAccess(storeId: number, userId: number) {
    try {
        const { payload: user, error: userError } = await getUserById(userId)

        if (userError || !user) return false

        const { payload: store, error: storeError } = await selectStoreById(storeId)

        if (storeError) return false

        if (store?.user_id !== userId) return false

        return true
    } catch (error) {
        console.error('Error in canDeleteStoreAccess:', error)
        return false
    }
}
