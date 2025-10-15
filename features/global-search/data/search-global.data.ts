import { formatSuccessResponse } from "@/features/global/utils"
import { SearchResultType } from "@/features/global-search/types"
import { prisma } from "@/utils/prisma"
import { createServerSideClient } from "@/utils/supabase/server"

async function searchGlobalData(query: string, userId: number) {

    if (!query.trim()) {
        return formatSuccessResponse("Empty query", [])
    }

    const supabase = createServerSideClient()

    const searchTerm = `%${query.toLowerCase()}%`

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

    const results: SearchResultType[] = []

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
        take: 5
    })

    if (products) {
        products.forEach(product => {
            const store = product.store
            results.push({
                id: product.id,
                type: 'product',
                title: product.name,
                subtitle: `SKU: ${product.sku} - $${product.price}`,
                href: `/stores/${store?.slug}/products/${product.id}`,
                icon: '📦'
            })
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
        take: 5
    })


    if (orders) {
        orders.forEach(order => {
            const store = order.store
            results.push({
                id: order.id,
                type: 'order',
                title: `Order #${order.id}`,
                subtitle: `${order.customer_name || order.customer_email} - $${order.total_price} (${order.status})`,
                href: `/stores/${store?.slug}/orders/${order.id}`,
                icon: '🛒'
            })
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
        .limit(3)

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
            results.push({
                id: customer.customer_email || customer.customer_name,
                type: 'customer',
                title: customer.customer_name || 'Unknown Customer',
                subtitle: customer.customer_email || 'No email',
                href: null,
                icon: '👤'
            })
        })
    }

    return formatSuccessResponse("Search completed", results.slice(0, 10))
}

export { searchGlobalData }