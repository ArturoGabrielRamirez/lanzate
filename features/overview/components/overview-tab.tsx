import { Suspense } from "react"
import { getOverviewData } from "../actions/get-overview-data"
import { OverviewTabProps } from "../types"
import {
    SalesOverviewWidget,
    ProductStoreCountWidget,
    SalesByMonthWidget,
    TopProductsWidget,
    QuickActionsBar
} from "./index"
import { Skeleton } from "@/components/ui/skeleton"

async function OverviewTab({ slug, userId }: OverviewTabProps) {

    const { payload: data, error, message } = await getOverviewData(slug)

    if (error || !data) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">
                    {message || "Error al cargar datos del overview"}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Quick Actions Bar */}
            <QuickActionsBar slug={slug} />
            {/* Top Row - Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SalesOverviewWidget data={data.salesOverview} />
                <ProductStoreCountWidget data={data.productStoreCount} />
            </div>

            {/* Second Row - Charts and Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-1">
                    <Suspense fallback={<ChartSkeleton />}>
                        <SalesByMonthWidget data={data.salesByMonth} />
                    </Suspense>
                </div>
                
                <div className="lg:col-span-1">
                    <TopProductsWidget data={data.topProducts} />
                </div>
            </div>

        </div>
    )
}

function ChartSkeleton() {
    return (
        <div className="p-6 border rounded-lg">
            <div className="space-y-4">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-[200px] w-full" />
            </div>
        </div>
    )
}

export default OverviewTab 