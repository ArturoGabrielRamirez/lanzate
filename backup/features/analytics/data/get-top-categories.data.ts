/* import { createServerSideClient } from "@/utils/supabase/server"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"

export async function getTopCategories(slug: string) {
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
                        price,
                        categories (
                            name
                        )
                    )
                )
            `)
            .eq('store_id', storeData.id)
            .eq('status', 'COMPLETED')
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

        if (error) {
            return formatErrorResponse("Error fetching top categories", error)
        }

        // Process data to get top categories and products by category
        const categorySales: Record<string, { 
            name: string; 
            totalQuantity: number; 
            totalRevenue: number;
            products: Record<string, { name: string; quantity: number; revenue: number }>
        }> = {}
        
        data?.forEach((order: any) => {
            order.order_items?.forEach((item: any) => {
                const product = item.products
                // Since products can have multiple categories, we'll use the first one or 'Uncategorized'
                const categoryName = product?.categories?.[0]?.name || 'Uncategorized'
                
                if (!categorySales[categoryName]) {
                    categorySales[categoryName] = {
                        name: categoryName,
                        totalQuantity: 0,
                        totalRevenue: 0,
                        products: {}
                    }
                }
                
                categorySales[categoryName].totalQuantity += item.quantity
                categorySales[categoryName].totalRevenue += (item.quantity * (product?.price || 0))
                
                // Track products within category
                const productId = item.product_id
                if (!categorySales[categoryName].products[productId]) {
                    categorySales[categoryName].products[productId] = {
                        name: product?.name || 'Unknown Product',
                        quantity: 0,
                        revenue: 0
                    }
                }
                categorySales[categoryName].products[productId].quantity += item.quantity
                categorySales[categoryName].products[productId].revenue += (item.quantity * (product?.price || 0))
            })
        })

        // Sort categories by total quantity and get top 10
        const topCategories = Object.entries(categorySales)
            .map(([name, data]) => ({
                id: name,
                name: data.name,
                quantity: data.totalQuantity,
                revenue: data.totalRevenue,
                products: Object.entries(data.products)
                    .map(([productId, productData]) => ({
                        id: productId,
                        name: productData.name,
                        quantity: productData.quantity,
                        revenue: productData.revenue
                    }))
                    .sort((a, b) => b.quantity - a.quantity)
                    .slice(0, 5) // Top 5 products per category
            }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10)

        return formatSuccessResponse("Top categories fetched successfully", topCategories)
    })
}  */