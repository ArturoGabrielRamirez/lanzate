"use server"

import { actionWrapper } from "@/features/global/utils"
import { getProductStoreCountData } from "@/features/overview/data/get-product-store-count.data"
import { getSalesByMonthData } from "@/features/overview/data/get-sales-by-month.data"
import { getSalesOverviewData } from "@/features/overview/data/get-sales-overview.data"
import { getTopProductsData } from "@/features/overview/data/get-top-products.data"
import { OverviewData } from "@/features/overview/types"
import { getStoresFromSlugAction } from "@/features/stores/actions/get-stores-from-slug.action"

export async function getOverviewInfoAction(slug: string) {
    return actionWrapper(async () => {
        // Get store first
        const { payload: store, hasError: storeError } = await getStoresFromSlugAction(slug)

        if (storeError || !store) throw new Error("Store not found")

        // Get all overview data in parallel
        const [
            salesOverviewResult,
            productStoreCountResult,
            salesByMonthResult,
            topProductsResult
        ] = await Promise.all([
            getSalesOverviewData(store.id),
            getProductStoreCountData(store.id),
            getSalesByMonthData(store.id),
            getTopProductsData(store.id, 5)
        ])

        // Check for errors
        if (salesOverviewResult.error) {
            throw new Error(salesOverviewResult.message)
        }
        if (productStoreCountResult.error) {
            throw new Error(productStoreCountResult.message)
        }
        if (salesByMonthResult.error) {
            throw new Error(salesByMonthResult.message)
        }
        if (topProductsResult.error) {
            throw new Error(topProductsResult.message)
        }

        const overviewData: OverviewData = {
            salesOverview: salesOverviewResult.payload!,
            productStoreCount: productStoreCountResult.payload!,
            salesByMonth: salesByMonthResult.payload!,
            topProducts: topProductsResult.payload!
        }

        return {
            hasError: false,
            message: "Overview data fetched successfully",
            payload: overviewData
        }

    })
} 