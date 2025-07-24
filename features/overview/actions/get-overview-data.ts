"use server"

import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"
import { getSalesOverview } from "../data/get-sales-overview"
import { getProductStoreCount } from "../data/get-product-store-count"
import { getSalesByMonth } from "../data/get-sales-by-month"
import { getTopProducts } from "../data/get-top-products"
import { OverviewData } from "../types"

export async function getOverviewData(slug: string) {
    try {
        // Get store first
        const { payload: store, error: storeError } = await getStoresFromSlug(slug)
        
        if (storeError || !store) {
            return {
                error: true,
                message: "Store not found",
                payload: null
            }
        }

        // Get all overview data in parallel
        const [
            salesOverviewResult,
            productStoreCountResult,
            salesByMonthResult,
            topProductsResult
        ] = await Promise.all([
            getSalesOverview(store.id),
            getProductStoreCount(store.id),
            getSalesByMonth(store.id),
            getTopProducts(store.id, 5)
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
            error: false,
            message: "Overview data fetched successfully",
            payload: overviewData
        }

    } catch (error) {
        return {
            error: true,
            message: error instanceof Error ? error.message : "Error fetching overview data",
            payload: null
        }
    }
} 