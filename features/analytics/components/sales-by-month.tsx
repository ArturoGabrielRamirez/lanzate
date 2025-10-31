/* import { Suspense } from "react"
import SalesByMonthServer from "./sales-by-month-server"
import SalesTrendServer from "./sales-trend-server"
import SalesPerformanceServer from "./sales-performance-server"
import ChartSkeleton from "./chart-skeleton"

type SalesByMonthProps = {
    slug: string
}

export default function SalesByMonth({ slug }: SalesByMonthProps) {
    return (
        <div className="lg:grid lg:grid-cols-2 2xl:grid-cols-3 flex flex-col gap-4 lg:gap-6">
            <Suspense fallback={<ChartSkeleton />}>
                <SalesByMonthServer slug={slug} />
            </Suspense>
            
            <Suspense fallback={<ChartSkeleton />}>
                <SalesTrendServer slug={slug} />
            </Suspense>
            
            <Suspense fallback={<ChartSkeleton />}>
                <SalesPerformanceServer slug={slug} />
            </Suspense>
        </div>
    )
}  */