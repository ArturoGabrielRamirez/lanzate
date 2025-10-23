"use server"

import { actionWrapper } from "@/features/global/utils";
import { selectOrdersFromStoreData } from "@/features/orders/data/select-orders-from-store.data";
import { getStoresFromSlugAction } from "@/features/stores/actions";

export async function getOrdersFromStoreAction(slug: string, limit?: number) {
    return actionWrapper(async () => {

        const { payload: store, hasError: storeError, message: storeMessage } = await getStoresFromSlugAction(slug)

        if (storeError || !store) throw new Error(storeMessage)

        const { payload: orders, error: ordersError, message: ordersMessage } = await selectOrdersFromStoreData(Number(store.id), limit)

        if (ordersError || !orders) throw new Error(ordersMessage)

        return {
            message: "Orders fetched successfully",
            payload: orders,
            hasError: false
        }
    })
}
