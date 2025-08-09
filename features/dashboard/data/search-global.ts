import { createServerSideClient } from "@/utils/supabase/server"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"

export async function searchGlobal(query: string, userId: number) {
    return actionWrapper(async () => {
        if (!query.trim()) {
            return formatSuccessResponse("Empty query", [])
        }

        const supabase = createServerSideClient()
        const searchTerm = `%${query.toLowerCase()}%`

        // Get user's stores to filter results
        const { data: userStores, error: storesError } = await supabase
            .from('stores')
            .select('id, slug')
            .eq('user_id', userId)

        if (storesError) {
            return formatErrorResponse("Error fetching user stores", storesError)
        }

        const storeIds = userStores?.map(store => store.id) || []
        if (storeIds.length === 0) {
            return formatSuccessResponse("No stores found", [])
        }

        const results: any[] = []

        // Search Products
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select(`
                id,
                name,
                sku,
                price,
                store_id,
                stores (slug)
            `)
            .in('store_id', storeIds)
            .or(`name.ilike.${searchTerm},sku.ilike.${searchTerm},id.eq.${parseInt(query) || 0}`)
            .limit(5)

        if (!productsError && products) {
            products.forEach(product => {
                results.push({
                    id: product.id,
                    type: 'product',
                    title: product.name,
                    subtitle: `SKU: ${product.sku} - $${product.price}`,
                    href: `/stores/${product.stores?.slug}/products/${product.id}`,
                    icon: '📦'
                })
            })
        }

        // Search Orders
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select(`
                id,
                customer_name,
                customer_email,
                total_price,
                status,
                store_id,
                stores (slug)
            `)
            .in('store_id', storeIds)
            .or(`customer_name.ilike.${searchTerm},customer_email.ilike.${searchTerm},id.eq.${parseInt(query) || 0}`)
            .limit(5)

        if (!ordersError && orders) {
            orders.forEach(order => {
                results.push({
                    id: order.id,
                    type: 'order',
                    title: `Order #${order.id}`,
                    subtitle: `${order.customer_name || order.customer_email} - $${order.total_price} (${order.status})`,
                    href: `/stores/${order.stores?.slug}/orders/${order.id}`,
                    icon: '🛒'
                })
            })
        }

        // Search Customers (from orders)
        const { data: customers, error: customersError } = await supabase
            .from('orders')
            .select(`
                customer_name,
                customer_email,
                store_id,
                stores (slug)
            `)
            .in('store_id', storeIds)
            .not('customer_name', 'is', null)
            .or(`customer_name.ilike.${searchTerm},customer_email.ilike.${searchTerm}`)
            .limit(3)

        if (!customersError && customers) {
            const uniqueCustomers = customers.reduce((acc: any[], customer) => {
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
                    href: null, // No direct link for customers
                    icon: '👤'
                })
            })
        }

        return formatSuccessResponse("Search completed", results.slice(0, 10)) // Limit to 10 total results
    })
} 