import { getSalesPerformanceAction } from "../actions/get-sales-performance-action"
import SalesPerformanceChartClient from "./sales-performance-chart-client"

type SalesPerformanceServerProps = {
    slug: string
}

export default async function SalesPerformanceServer({ slug }: SalesPerformanceServerProps) {
    const result = await getSalesPerformanceAction(slug, 'daily')

    if (result.error) {
        return (
            <div className="p-4 text-center">
                <p className="text-muted-foreground">Error loading data: {result.message}</p>
            </div>
        )
    }

    const salesPerformance = result.payload

    const chartData = salesPerformance.map((period: any) => ({
        name: period.timeUnit,
        revenue: period.totalRevenue,
        orders: period.totalOrders,
        quantity: period.totalQuantity,
        averageOrder: period.averageOrderValue
    }))

    return <SalesPerformanceChartClient data={chartData} />
} 