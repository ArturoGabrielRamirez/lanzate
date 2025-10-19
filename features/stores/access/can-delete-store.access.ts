"use server"

import { getUserById } from "@/features/layout/data/getUserById"
import { selectStoreByIdData } from "@/features/stores/data/select-store-by-id.data"

export async function canDeleteStoreAccess(storeId: number, userId: number) {
    try {
        const { payload: user, error: userError } = await getUserById(userId)

        if (userError || !user) return false

        const { payload: store, hasError: storeError } = await selectStoreByIdData(storeId)

        if (storeError) return false

        if (store?.user_id !== userId) return false

        return true
    } catch (error) {
        console.error('Error in canDeleteStoreAccess:', error)
        return false
    }
}
