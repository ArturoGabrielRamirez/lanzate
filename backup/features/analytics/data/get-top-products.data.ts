/* import { createServerSideClient } from "@/utils/supabase/server"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"

export async function getTopProducts(slug: string) {
    return actionWrapper(async () => {
        const supabase = createServerSideClient()

        // First get the store_id from the slug
        const { data: storeData, error: storeError } = await supabase
            .from('stores')
            .select('id')
            .eq('slug', slug)
            .single()

        if (storeError || !storeData) {
            return formatErrorResponse("Store not found", storeError)
        }

        const { data, error } = await supabase
            .from('orders')
            .select(`
                order_items (
                    product_id,
                    quantity,
                    products (
                        name,
                        price
                    )
                )
            `)
            .eq('store_id', storeData.id)
            .eq('status', 'COMPLETED')
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

        if (error) {
            return formatErrorResponse("Error fetching top products", error)
        }

        // Process data to get top products
        const productSales: Record<string, { name: string; totalQuantity: number; totalRevenue: number }> = {}

        data?.forEach((order: any) => {
            order.order_items?.forEach((item: any) => {
                const productId = item.product_id
                const product = item.products

                if (!productSales[productId]) {
                    productSales[productId] = {
                        name: product?.name || 'Unknown Product',
                        totalQuantity: 0,
                        totalRevenue: 0
                    }
                }

                productSales[productId].totalQuantity += item.quantity
                productSales[productId].totalRevenue += (item.quantity * (product?.price || 0))
            })
        })

        // Sort by total quantity and get top 10
        const topProducts = Object.entries(productSales)
            .map(([id, data]) => ({
                id,
                name: data.name,
                quantity: data.totalQuantity,
                revenue: data.totalRevenue
            }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10)

        return formatSuccessResponse("Top products fetched successfully", topProducts)
    })
}  */