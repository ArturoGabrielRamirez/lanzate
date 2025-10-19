"use server"

import { getUserById } from "@/features/layout/data/getUserById"
import { selectStoreBySlugData } from "@/features/stores/data"

export async function canUpdateStore(slug: string, userId: number) {
    try {
        const { payload: user, error: userError } = await getUserById(userId)

        if (userError || !user) return false

        const { payload: store, hasError: storeError } = await selectStoreBySlugData(slug)

        if (storeError) return false

        if (store?.user_id !== userId) return false

        return true
    } catch (error) {
        return false
    }
}
