/* import { getTopCategoriesAction } from "../actions/get-top-categories-action.action"
import TopCategoriesChartClient from "./top-categories-chart-client"

type TopCategoriesServerProps = {
    slug: string
}

export default async function TopCategoriesServer({ slug }: TopCategoriesServerProps) {
    const result = await getTopCategoriesAction(slug)

    if (result.error) {
        return (
            <div className="p-4 text-center">
                <p className="text-muted-foreground">Error loading data: {result.message}</p>
            </div>
        )
    }

    const topCategories = result.payload

    const chartData = topCategories.map((category: any) => ({
        name: category.name,
        quantity: category.quantity,
        revenue: category.revenue,
        productCount: category.products.length
    }))

    const pieData = topCategories.map((category: any) => ({
        name: category.name,
        value: category.quantity
    }))

    return <TopCategoriesChartClient data={chartData} pieData={pieData} />
}  */