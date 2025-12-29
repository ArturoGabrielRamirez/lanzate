/* import { getSalesTrendAction } from "../actions/get-sales-trend-action.action"
import SalesTrendChartClient from "./sales-trend-chart-client"

type SalesTrendServerProps = {
    slug: string
}

export default async function SalesTrendServer({ slug }: SalesTrendServerProps) {
    const result = await getSalesTrendAction(slug, 'daily')

    if (result.error) {
        return (
            <div className="p-4 text-center">
                <p className="text-muted-foreground">Error loading data: {result.message}</p>
            </div>
        )
    }

    const salesTrend = result.payload

    const chartData = salesTrend.map((period: any) => ({
        name: period.period,
        revenue: period.totalRevenue,
        orders: period.totalOrders,
        quantity: period.totalQuantity,
        averageOrder: period.averageOrderValue
    }))

    return <SalesTrendChartClient data={chartData} />
}  */