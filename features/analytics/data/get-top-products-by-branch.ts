import { createServerSideClient } from "@/utils/supabase/server"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"

export async function getTopProductsByBranch(slug: string) {
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
                branch_id,
                order_items (
                    product_id,
                    quantity,
                    products (
                        name,
                        price
                    )
                ),
                branches (
                    name
                )
            `)
            .eq('store_id', storeData.id)
            .eq('status', 'COMPLETED')
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

        if (error) {
            return formatErrorResponse("Error fetching top products by branch", error)
        }

        // Process data to get top products by branch
        const branchSales: Record<string, { 
            name: string; 
            products: Record<string, { name: string; quantity: number; revenue: number }>
        }> = {}
        
        data?.forEach((order: any) => {
            const branchId = order.branch_id
            const branchName = order.branches?.name || 'Unknown Branch'
            
            if (!branchSales[branchId]) {
                branchSales[branchId] = {
                    name: branchName,
                    products: {}
                }
            }
            
            order.order_items?.forEach((item: any) => {
                const product = item.products
                const productId = item.product_id
                
                if (!branchSales[branchId].products[productId]) {
                    branchSales[branchId].products[productId] = {
                        name: product?.name || 'Unknown Product',
                        quantity: 0,
                        revenue: 0
                    }
                }
                
                branchSales[branchId].products[productId].quantity += item.quantity
                branchSales[branchId].products[productId].revenue += (item.quantity * (product?.price || 0))
            })
        })

        // Sort products by quantity within each branch and get top 5 per branch
        const topProductsByBranch = Object.entries(branchSales)
            .map(([branchId, data]) => ({
                id: branchId,
                name: data.name,
                products: Object.entries(data.products)
                    .map(([productId, productData]) => ({
                        id: productId,
                        name: productData.name,
                        quantity: productData.quantity,
                        revenue: productData.revenue
                    }))
                    .sort((a, b) => b.quantity - a.quantity)
                    .slice(0, 5) // Top 5 products per branch
            }))
            .sort((a, b) => {
                // Sort branches by total quantity of their top product
                const aTopQuantity = a.products[0]?.quantity || 0
                const bTopQuantity = b.products[0]?.quantity || 0
                return bTopQuantity - aTopQuantity
            })

        return formatSuccessResponse("Top products by branch fetched successfully", topProductsByBranch)
    })
} 