import { createServerSideClient } from "@/utils/supabase/server"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"

export async function getSalesByMonth(slug: string) {
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

        // Get orders for the last 12 months
        const twelveMonthsAgo = new Date()
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

        const { data, error } = await supabase
            .from('orders')
            .select(`
                id,
                total_price,
                total_quantity,
                created_at,
                status
            `)
            .eq('store_id', storeData.id)
            .eq('status', 'COMPLETED')
            .gte('created_at', twelveMonthsAgo.toISOString())
            .order('created_at', { ascending: true })

        if (error) {
            return formatErrorResponse("Error fetching sales by month", error)
        }

        // Group by month and calculate totals
        const monthlySales: Record<string, { 
            month: string; 
            totalRevenue: number; 
            totalOrders: number; 
            totalQuantity: number;
            averageOrderValue: number;
            monthNumber: number;
            year: number;
        }> = {}

        data?.forEach((order: any) => {
            const date = new Date(order.created_at)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

            if (!monthlySales[monthKey]) {
                monthlySales[monthKey] = {
                    month: monthName,
                    totalRevenue: 0,
                    totalOrders: 0,
                    totalQuantity: 0,
                    averageOrderValue: 0,
                    monthNumber: date.getMonth() + 1,
                    year: date.getFullYear()
                }
            }

            monthlySales[monthKey].totalRevenue += order.total_price
            monthlySales[monthKey].totalOrders += 1
            monthlySales[monthKey].totalQuantity += order.total_quantity
        })

        // Calculate average order value and sort by date
        const salesByMonth = Object.values(monthlySales)
            .map(month => ({
                ...month,
                averageOrderValue: month.totalRevenue / month.totalOrders
            }))
            .sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year
                return a.monthNumber - b.monthNumber
            })

        return formatSuccessResponse("Sales by month fetched successfully", salesByMonth)
    })
} 