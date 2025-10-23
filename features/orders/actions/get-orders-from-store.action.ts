"use server"

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils";
import { selectOrdersFromStoreData } from "@/features/orders/data/select-orders-from-store.data";
import { getStoresFromSlugAction } from "@/features/stores/actions";

export async function getOrdersFromStoreAction(slug: string, limit?: number) {
    return actionWrapper(async () => {

        const { payload: store, hasError: storeError, message: storeMessage } = await getStoresFromSlugAction(slug)

        if (storeError || !store) throw new Error(storeMessage)

        const { payload: orders, hasError: ordersError, message: ordersMessage } = await selectOrdersFromStoreData(Number(store.id), limit)

        if (ordersError || !orders) throw new Error(ordersMessage)

        return formatSuccessResponse("Orders fetched successfully", orders)
    })
}
