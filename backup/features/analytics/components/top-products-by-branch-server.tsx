/* import { getTopProductsByBranchAction } from "../actions/get-top-products-by-branch-action.action"
import TopProductsByBranchChartClient from "./top-products-by-branch-chart-client"

type TopProductsByBranchServerProps = {
    slug: string
}

export default async function TopProductsByBranchServer({ slug }: TopProductsByBranchServerProps) {
    const result = await getTopProductsByBranchAction(slug)

    if (result.error) {
        return (
            <div className="p-4 text-center">
                <p className="text-muted-foreground">Error loading data: {result.message}</p>
            </div>
        )
    }

    const topProductsByBranch = result.payload

    // Flatten data for bar chart
    const chartData = topProductsByBranch.flatMap((branch: any) => 
        branch.products.map((product: any) => ({
            name: `${branch.name} - ${product.name}`,
            branch: branch.name,
            product: product.name,
            quantity: product.quantity,
            revenue: product.revenue
        }))
    )

    // Data for pie chart (top products across all branches)
    const allProducts: Record<string, { name: string; quantity: number; revenue: number }> = {}
    topProductsByBranch.forEach((branch: any) => {
        branch.products.forEach((product: any) => {
            if (!allProducts[product.id]) {
                allProducts[product.id] = {
                    name: product.name,
                    quantity: 0,
                    revenue: 0
                }
            }
            allProducts[product.id].quantity += product.quantity
            allProducts[product.id].revenue += product.revenue
        })
    })

    const pieData = Object.values(allProducts)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10)
        .map(product => ({
            name: product.name,
            value: product.quantity
        }))

    return <TopProductsByBranchChartClient data={chartData} pieData={pieData} />
}  */