import { formatSuccessResponse } from "@/features/global/utils"
import { SEARCH_CONFIG } from "@/features/global-search/constants"
import { searchCustomersData } from "@/features/global-search/data/search-customers.data"
import { searchOrdersData } from "@/features/global-search/data/search-orders.data"
import { searchProductsData } from "@/features/global-search/data/search-products.data"
import { SearchResult } from "@/features/global-search/types"
import { createProductSearchResult, createOrderSearchResult, createCustomerSearchResult } from "@/features/global-search/utils"
import { getStoresFromUser } from "@/features/stores/actions/getStoresFromUser"

async function searchGlobalData(query: string, userId: number) {
    if (!query.trim()) {
        return formatSuccessResponse("Empty query", [])
    }

    // Get user stores
    const { payload: stores, error: storesError } = await getStoresFromUser(userId)

    if (storesError || !stores || stores.length === 0) {
        throw new Error("Empty search. You need to create a store and create a product to search for it.")
    }

    const storeIds = stores.map(store => store.id)
    const searchTerm = `%${query.toLowerCase()}%`

    // Execute all searches in parallel
    const [products, orders, customers] = await Promise.all([
        searchProductsData(searchTerm, storeIds, SEARCH_CONFIG.MAX_RESULTS_PER_TYPE.PRODUCTS),
        searchOrdersData(searchTerm, storeIds, SEARCH_CONFIG.MAX_RESULTS_PER_TYPE.ORDERS),
        searchCustomersData(searchTerm, storeIds, SEARCH_CONFIG.MAX_RESULTS_PER_TYPE.CUSTOMERS)
    ])

    // Build search results
    const results: SearchResult[] = []

    // Add products
    products.forEach(product => {
        results.push(createProductSearchResult(product))
    })

    // Add orders
    orders.forEach(order => {
        results.push(createOrderSearchResult({
            ...order,
            customer_email: order.customer_email || ''
        }))
    })

    // Add customers
    customers.forEach(customer => {
        results.push(createCustomerSearchResult(customer))
    })

    return formatSuccessResponse("Search completed", results.slice(0, SEARCH_CONFIG.MAX_TOTAL_RESULTS))
}

export { searchGlobalData }