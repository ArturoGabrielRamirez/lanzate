"use server"

import { getUserById } from "@/features/global/data/getUserById"
import { selectStoreByIdData } from "@/features/stores/data"

export async function canDeleteStoreAccess(storeId: number, userId: number) {
    try {
        const { payload: user, error: userError } = await getUserById(userId)

        if (userError || !user) return false

        const { payload: store, hasError: storeError } = await selectStoreByIdData(storeId)

        if (storeError) return false

        if (store?.user_id !== userId) return false

        return true
    } catch (error) {
        return false
    }
}
