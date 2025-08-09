import { getSalesByMonthAction } from "../actions/get-sales-by-month-action"
import SalesByMonthChartClient from "./sales-by-month-chart-client"

type SalesByMonthServerProps = {
    slug: string
}

export default async function SalesByMonthServer({ slug }: SalesByMonthServerProps) {
    const result = await getSalesByMonthAction(slug)

    if (result.error) {
        return (
            <div className="p-4 text-center">
                <p className="text-muted-foreground">Error loading data: {result.message}</p>
            </div>
        )
    }

    const salesByMonth = result.payload

    const chartData = salesByMonth.map((month: any) => ({
        name: month.month,
        revenue: month.totalRevenue,
        orders: month.totalOrders,
        quantity: month.totalQuantity,
        averageOrder: month.averageOrderValue
    }))

    return <SalesByMonthChartClient data={chartData} />
} 