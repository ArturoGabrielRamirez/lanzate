"use server"

import { actionWrapper } from "@/features/global/utils";
import { getStoresFromSlug } from "@/features/stores/actions/get-stores-from-slug.action";
import { selectOrdersFromStore } from "@/features/stores/data/selectOrdersFromStore";

export async function getOrdersFromStore(slug: string, limit?: number) {
    return actionWrapper(async () => {

        const { payload: store, error: storeError, message: storeMessage } = await getStoresFromSlug(slug)

        if (storeError || !store) throw new Error(storeMessage)

        const { payload: orders, error: ordersError, message: ordersMessage } = await selectOrdersFromStore(Number(store.id), limit)

        if (ordersError || !orders) throw new Error(ordersMessage)

        return {
            message: "Orders fetched successfully",
            payload: orders,
            hasError: false
        }
    })
}
