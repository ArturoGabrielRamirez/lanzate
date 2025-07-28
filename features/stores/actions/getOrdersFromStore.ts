"use server"
import { actionWrapper } from "@/utils/lib";
import { selectOrdersFromStore } from "../data/selectOrdersFromStore";
import { getStoresFromSlug } from "./getStoresFromSlug";
import { Order, OrderItem, Branch, OrderPayment, User } from "@/prisma/generated/prisma";

type getOrdersFromStoreReturn = Promise<{
    message: string
    payload: (Order & {
        items: OrderItem[]
        branch: Branch
        payment: OrderPayment
        user: User
    })[]
    error: boolean
}>

export async function getOrdersFromStore(slug: string): getOrdersFromStoreReturn {
    return actionWrapper(async () => {

        const { payload: store, error: storeError, message: storeMessage } = await getStoresFromSlug(slug)

        if (storeError || !store) throw new Error(storeMessage)

        const { payload: orders, error: ordersError, message: ordersMessage } = await selectOrdersFromStore(Number(store.id))

        if (ordersError || !orders) throw new Error(ordersMessage)

        return {
            message: "Orders fetched successfully",
            payload: orders,
            error: false
        }
    })
}
