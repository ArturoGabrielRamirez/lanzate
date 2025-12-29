/* import { getTopProductsAction } from "../actions/get-top-products-action.action"
import TopProductsChartClient from "./top-products-chart-client"

type TopProductsServerProps = {
    slug: string
}

export default async function TopProductsServer({ slug }: TopProductsServerProps) {
    const result = await getTopProductsAction(slug)

    if (result.error) {
        return (
            <div className="p-4 text-center">
                <p className="text-muted-foreground">Error loading data: {result.message}</p>
            </div>
        )
    }

    const topProducts = result.payload

    const chartData = topProducts.map((product: any) => ({
        name: product.name,
        quantity: product.quantity,
        revenue: product.revenue
    }))

    const pieData = topProducts.map((product: any) => ({
        name: product.name,
        value: product.quantity
    }))

    return <TopProductsChartClient data={chartData} pieData={pieData} />
}  */