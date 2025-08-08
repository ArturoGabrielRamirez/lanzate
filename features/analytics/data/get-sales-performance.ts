import { createServerSideClient } from "@/utils/supabase/server"
import { actionWrapper, formatErrorResponse, formatSuccessResponse } from "@/utils/lib"

export async function getSalesPerformance(slug: string, timeUnit: 'hourly' | 'daily' | 'monthly' = 'daily') {
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

        // Calculate date range based on time unit
        const endDate = new Date()
        let startDate = new Date()
        
        switch (timeUnit) {
            case 'hourly':
                startDate.setDate(startDate.getDate() - 7) // Last 7 days for hourly
                break
            case 'daily':
                startDate.setDate(startDate.getDate() - 30) // Last 30 days
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
            return formatErrorResponse("Error fetching sales performance", error)
        }

        // Group by time unit and calculate performance metrics
        const performanceData: Record<string, { 
            timeUnit: string; 
            totalRevenue: number; 
            totalOrders: number; 
            totalQuantity: number;
            averageOrderValue: number;
            peakHour?: number;
            dayOfWeek?: number;
            month?: number;
        }> = {}

        data?.forEach((order: any) => {
            const date = new Date(order.created_at)
            let timeKey: string
            let timeLabel: string

            switch (timeUnit) {
                case 'hourly':
                    timeKey = `${date.getDay()}-${date.getHours()}`
                    timeLabel = `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.getHours()}:00`
                    break
                case 'daily':
                    timeKey = date.toISOString().split('T')[0]
                    timeLabel = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
                    break
                case 'monthly':
                    timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                    timeLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    break
            }

            if (!performanceData[timeKey]) {
                performanceData[timeKey] = {
                    timeUnit: timeLabel,
                    totalRevenue: 0,
                    totalOrders: 0,
                    totalQuantity: 0,
                    averageOrderValue: 0,
                    peakHour: timeUnit === 'hourly' ? date.getHours() : undefined,
                    dayOfWeek: timeUnit === 'daily' ? date.getDay() : undefined,
                    month: timeUnit === 'monthly' ? date.getMonth() + 1 : undefined
                }
            }

            performanceData[timeKey].totalRevenue += order.total_price
            performanceData[timeKey].totalOrders += 1
            performanceData[timeKey].totalQuantity += order.total_quantity
        })

        // Calculate averages and sort appropriately
        const salesPerformance = Object.values(performanceData)
            .map(period => ({
                ...period,
                averageOrderValue: period.totalRevenue / period.totalOrders
            }))
            .sort((a, b) => {
                if (timeUnit === 'hourly' && a.peakHour !== undefined && b.peakHour !== undefined) {
                    return a.peakHour - b.peakHour
                }
                if (timeUnit === 'daily' && a.dayOfWeek !== undefined && b.dayOfWeek !== undefined) {
                    return a.dayOfWeek - b.dayOfWeek
                }
                if (timeUnit === 'monthly' && a.month !== undefined && b.month !== undefined) {
                    return a.month - b.month
                }
                return 0
            })

        return formatSuccessResponse("Sales performance fetched successfully", salesPerformance)
    })
} 