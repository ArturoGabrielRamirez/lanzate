import TableSkeleton from "@/features/stores/components/tabs/table-skeleton"
import OverviewSkeleton from "@/features/stores/components/tabs/overview-skeleton"
import { TabPageProps } from "@/features/stores/types"
import { lazy, Suspense } from "react"

async function TabPage({ params }: TabPageProps) {

    const { tab, slug } = await params
    const LazyComponent = lazy(() => import(`@/features/stores/components/tabs/${tab}`))

    // Choose the appropriate skeleton based on the tab
    const SkeletonComponent = tab === 'overview' ? OverviewSkeleton : TableSkeleton

    return (
        <Suspense fallback={<SkeletonComponent />}>
            <LazyComponent slug={slug} />
        </Suspense>
    )
}
export default TabPage