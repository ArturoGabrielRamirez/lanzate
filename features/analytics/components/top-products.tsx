import { Suspense } from "react"
import TopProductsServer from "./top-products-server"
import TopCategoriesServer from "./top-categories-server"
import TopProductsByBranchServer from "./top-products-by-branch-server"
import ChartSkeleton from "./chart-skeleton"

type TopProductsProps = {
    slug: string
}

export default function TopProducts({ slug }: TopProductsProps) {
    return (
        <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6">
            <Suspense fallback={<ChartSkeleton />}>
                <TopProductsServer slug={slug} />
            </Suspense>
            
            <Suspense fallback={<ChartSkeleton />}>
                <TopCategoriesServer slug={slug} />
            </Suspense>
            
            <Suspense fallback={<ChartSkeleton />}>
                <TopProductsByBranchServer slug={slug} />
            </Suspense>
        </div>
    )
} 