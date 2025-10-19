'use server'

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { SEARCH_CONFIG } from "@/features/global-search/constants"
import { searchCustomersData } from "@/features/global-search/data/search-customers.data"
import { searchOrdersData } from "@/features/global-search/data/search-orders.data"
import { searchProductsData } from "@/features/global-search/data/search-products.data"
import { SearchResult } from "@/features/global-search/types"
import { createProductSearchResult, createOrderSearchResult, createCustomerSearchResult } from "@/features/global-search/utils"
import { getStoresFromUserAction } from "@/features/stores/actions/get-stores-from-user.action"

export async function searchGlobalAction(query: string, userId: number) {
    return actionWrapper(async () => {
        
        if (!query.trim()) {
            return formatSuccessResponse("Empty query", [])
        }

        const { payload: stores, hasError: storesError } = await getStoresFromUserAction(userId)

        if (storesError || !stores || stores.length === 0) {
            throw new Error("Empty search. You need to create a store and create a product to search for it.")
        }

        const storeIds = stores.map(store => store.id)
        const searchTerm = `%${query.toLowerCase()}%`

        const [products, orders, customers] = await Promise.all([
            searchProductsData(searchTerm, storeIds, SEARCH_CONFIG.MAX_RESULTS_PER_TYPE.PRODUCTS),
            searchOrdersData(searchTerm, storeIds, SEARCH_CONFIG.MAX_RESULTS_PER_TYPE.ORDERS),
            searchCustomersData(searchTerm, storeIds, SEARCH_CONFIG.MAX_RESULTS_PER_TYPE.CUSTOMERS)
        ])

        const results: SearchResult[] = []

        products.forEach(product => {
            results.push(createProductSearchResult(product))
        })

        orders.forEach(order => {
            results.push(createOrderSearchResult({
                ...order,
                customer_email: order.customer_email || ''
            }))
        })

        customers.forEach(customer => {
            results.push(createCustomerSearchResult(customer))
        })

        return formatSuccessResponse("Search completed", results.slice(0, SEARCH_CONFIG.MAX_TOTAL_RESULTS))
    })
} 