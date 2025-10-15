import { formatSuccessResponse } from "@/features/global/utils"
import { SEARCH_CONFIG } from "@/features/global-search/constants"
import { SearchResult } from "@/features/global-search/types"
import { formatSearchTerm, createProductSearchResult, createOrderSearchResult, createCustomerSearchResult } from "@/features/global-search/utils"
import { prisma } from "@/utils/prisma"
import { createServerSideClient } from "@/utils/supabase/server"

async function searchGlobalData(query: string, userId: number) {

    if (!query.trim()) {
        return formatSuccessResponse("Empty query", [])
    }

    const supabase = createServerSideClient()

    const searchTerm = formatSearchTerm(query)

    const stores = await prisma.store.findMany({
        where: {
            user_id: userId
        },
        select: {
            id: true,
            slug: true
        }
    })

    if (stores.length === 0) throw new Error("Empty search. You need to create a store and create a product to search for it.")

    const storeIds = stores.map(store => store.id)

    const results: SearchResult[] = []

    const products = await prisma.product.findMany({
        where: {
            store_id: {
                in: storeIds
            },
            is_deleted: false,
            OR: [
                {
                    name: {
                        contains: searchTerm
                    }
                }
            ]
        },
        select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            store_id: true,
            store: {
                select: {
                    slug: true,
                }
            },
        },
        take: SEARCH_CONFIG.MAX_RESULTS_PER_TYPE.PRODUCTS
    })

    if (products) {
        products.forEach(product => {
            results.push(createProductSearchResult(product))
        })
    }

    const orders = await prisma.order.findMany({
        where: {
            store_id: {
                in: storeIds
            },
            OR: [
                {
                    customer_name: {
                        contains: searchTerm
                    }
                }
            ]
        },
        select: {
            id: true,
            customer_name: true,
            customer_email: true,
            total_price: true,
            status: true,
            store_id: true,
            store: {
                select: {
                    slug: true,
                }
            },
        },
        take: SEARCH_CONFIG.MAX_RESULTS_PER_TYPE.ORDERS
    })

    if (orders) {
        orders.forEach(order => {
            results.push(createOrderSearchResult({
                ...order,
                customer_email: order.customer_email || ''
            }))
        })
    }

    const { data: customers, error: customersError } = await supabase
        .from('orders')
        .select(`
                customer_name,
                customer_email,
                store_id,
                stores!inner (slug)
            `)
        .in('store_id', storeIds)
        .not('customer_name', 'is', null)
        .or(`customer_name.ilike.${searchTerm},customer_email.ilike.${searchTerm}`)
        .limit(SEARCH_CONFIG.MAX_RESULTS_PER_TYPE.CUSTOMERS)

    if (customersError) throw new Error("Error fetching customers")

    if (customers) {
        const uniqueCustomers = customers.reduce((acc: typeof customers, customer) => {
            const existingCustomer = acc.find(c =>
                c.customer_email === customer.customer_email ||
                c.customer_name === customer.customer_name
            )
            if (!existingCustomer) {
                acc.push(customer)
            }
            return acc
        }, [])

        uniqueCustomers.forEach(customer => {
            results.push(createCustomerSearchResult(customer))
        })
    }

    return formatSuccessResponse("Search completed", results.slice(0, SEARCH_CONFIG.MAX_TOTAL_RESULTS))
}

export { searchGlobalData }