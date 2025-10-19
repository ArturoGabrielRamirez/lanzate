"use server"

import { Branch, Store, Product, Category, StoreBalance, StoreOperationalSettings, ProductStock } from "@prisma/client"

import { actionWrapper } from "@/features/global/utils"
import { selectStoreBySlug } from "@/features/stores/data/selectStoreBySlug"

type GetStoresFromSlugReturn = {
    message: string
    payload: Store & {
        branches: (Branch & { stock: ProductStock[] })[],
        products: (Product & { categories: Category[] })[],
        balance: StoreBalance,
        operational_settings: StoreOperationalSettings | null
    } | null
    hasError: boolean
}

export async function getStoresFromSlugAction(slug: string): Promise<GetStoresFromSlugReturn> {

    return actionWrapper(async () => {
        const { payload: store, error, message } = await selectStoreBySlug(slug)

        if (error) throw new Error(message)

        if (!store)
            throw new Error("Store not found")

        return {
            message: "Store fetched successfully from db",
            payload: store as Store & {
                branches: (Branch & { stock: ProductStock[] })[],
                products: (Product & { categories: Category[] })[],
                balance: StoreBalance,
                operational_settings: StoreOperationalSettings | null
            },
            hasError: false
        }
    })
}
