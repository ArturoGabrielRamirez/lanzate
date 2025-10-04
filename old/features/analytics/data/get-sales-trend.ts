import { createServerSideClient } from "@/utils/supabase/server"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"

export async function getSalesTrend(slug: string, period: 'daily' | 'weekly' | 'monthly' = 'daily') {
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

        // Calculate date range based on period
        const endDate = new Date()
        let startDate = new Date()
        
        switch (period) {
            case 'daily':
                startDate.setDate(startDate.getDate() - 30) // Last 30 days
                break
            case 'weekly':
                startDate.setDate(startDate.getDate() - 90) // Last 90 days
                break
            case 'monthly':
                startDate.setMonth(startDate.getMonth() - 12) // Last 12 months
                break
        }

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
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .order('created_at', { ascending: true })

        if (error) {
            return formatErrorResponse("Error fetching sales trend", error)
        }

        // Group by period and calculate trends
        const trendData: Record<string, { 
            period: string; 
            totalRevenue: number; 
            totalOrders: number; 
            totalQuantity: number;
            averageOrderValue: number;
            date: Date;
        }> = {}

        data?.forEach((order: any) => {
            const date = new Date(order.created_at)
            let periodKey: string
            let periodLabel: string

            switch (period) {
                case 'daily':
                    periodKey = date.toISOString().split('T')[0]
                    periodLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    break
                case 'weekly':
                    const weekStart = new Date(date)
                    weekStart.setDate(date.getDate() - date.getDay())
                    periodKey = weekStart.toISOString().split('T')[0]
                    periodLabel = `Week ${Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)}`
                    break
                case 'monthly':
                    periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                    periodLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    break
            }

            if (!trendData[periodKey]) {
                trendData[periodKey] = {
                    period: periodLabel,
                    totalRevenue: 0,
                    totalOrders: 0,
                    totalQuantity: 0,
                    averageOrderValue: 0,
                    date: date
                }
            }

            trendData[periodKey].totalRevenue += order.total_price
            trendData[periodKey].totalOrders += 1
            trendData[periodKey].totalQuantity += order.total_quantity
        })

        // Calculate averages and sort by date
        const salesTrend = Object.values(trendData)
            .map(period => ({
                ...period,
                averageOrderValue: period.totalRevenue / period.totalOrders
            }))
            .sort((a, b) => a.date.getTime() - b.date.getTime())

        return formatSuccessResponse("Sales trend fetched successfully", salesTrend)
    })
} 