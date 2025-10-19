"use server"

import { getUserById } from "@/features/layout/data/getUserById"
import { selectStoreBySlug } from "../data/selectStoreBySlug"

export async function canUpdateStore(slug: string, userId: number) {
    try {
        const { payload: user, error: userError } = await getUserById(userId)

        if (userError || !user) return false

        const { payload: store, error: storeError } = await selectStoreBySlug(slug)

        if (storeError) return false

        if (store?.user_id !== userId) return false

        return true
    } catch (error) {
        return false
    }
}
