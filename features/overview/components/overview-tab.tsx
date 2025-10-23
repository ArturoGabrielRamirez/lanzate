import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

import { getOverviewData } from "@/features/overview/actions/get-overview-data"
import { SalesOverviewWidget, ProductStoreCountWidget, SalesByMonthWidget, TopProductsWidget } from "@/features/overview/components"
import { OverviewTabProps } from "@/features/overview/types"
import { Skeleton } from "@/features/shadcn/components/ui/skeleton"
import { getStoresFromSlugAction } from "@/features/stores/actions/get-stores-from-slug.action"

async function OverviewTab({ slug }: OverviewTabProps) {

    const t = await getTranslations("overview")

    const [
        { payload: data, error, message },
        { payload: store, hasError: storeError }
    ] = await Promise.all([
        getOverviewData(slug),
        getStoresFromSlugAction(slug)
    ])

    if (error || !data) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">
                    {message || t("error-loading-overview")}
                </p>
            </div>
        )
    }

    if (storeError || !store) {
        return (
            <div className="text-center p-8">
                <p className="text-muted-foreground">
                    {t("error-loading-store")}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                    <ProductStoreCountWidget data={data.productStoreCount} />
                    <TopProductsWidget data={data.topProducts} />
                </div>
                <div className="lg:col-span-1">
                    <Suspense fallback={<ChartSkeleton />}>
                        <SalesByMonthWidget data={data.salesByMonth} />
                    </Suspense>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SalesOverviewWidget data={data.salesOverview} />
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