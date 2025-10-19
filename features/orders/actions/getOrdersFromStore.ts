"use server"

import { actionWrapper } from "@/features/global/utils";
import { selectOrdersFromStore } from "@/features/orders/data/selectOrdersFromStore";
import { getStoresFromSlugAction } from "@/features/stores/actions";

export async function getOrdersFromStore(slug: string, limit?: number) {
    return actionWrapper(async () => {

        const { payload: store, hasError: storeError, message: storeMessage } = await getStoresFromSlugAction(slug)

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
