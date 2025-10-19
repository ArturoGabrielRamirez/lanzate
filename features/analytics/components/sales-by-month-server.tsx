/* import { getSalesByMonthAction } from "@/features/analytics/actions"
import SalesByMonthChartClient from "@/features/analytics/components"

export async function SalesByMonthServer({ slug }: SalesByMonthServerProps) {
    const result = await getSalesByMonthAction(slug)

    if (result.error) {
        return (
            <div className="p-4 text-center">
                <p className="text-muted-foreground">Error loading data: {result.message}</p>
            </div>
        )
    }

    const salesByMonth = result.payload

    const chartData = salesByMonth.map((month: { month: string; totalRevenue: number; totalOrders: number; totalQuantity: number; averageOrderValue: number }) => ({
        name: month.month,
        revenue: month.totalRevenue,
        orders: month.totalOrders,
        quantity: month.totalQuantity,
        averageOrder: month.averageOrderValue
    }))

    return <SalesByMonthChartClient data={chartData} />
}  */