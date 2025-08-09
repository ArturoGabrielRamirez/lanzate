import TableSkeleton from "@/features/stores/components/tabs/table-skeleton"
import OverviewSkeleton from "@/features/stores/components/tabs/overview-skeleton"
import AccountSkeleton from "@/features/stores/components/tabs/account-skeleton"
import StylesSkeleton from "@/features/stores/components/tabs/styles-skeleton"
import { TabPageProps } from "@/features/stores/types"
import { lazy, Suspense } from "react"

async function TabPage({ params }: TabPageProps) {

    const { tab, slug } = await params
    const LazyComponent = lazy(() => import(`@/features/stores/components/tabs/${tab}`))

    // Choose the appropriate skeleton based on the tab
    const getSkeletonComponent = () => {
        switch (tab) {
            case 'overview':
                return OverviewSkeleton
            case 'account':
                return AccountSkeleton
            case 'styles':
                return StylesSkeleton
            default:
                return TableSkeleton
        }
    }

    const SkeletonComponent = getSkeletonComponent()

    return (
        <Suspense fallback={<SkeletonComponent />}>
            <LazyComponent slug={slug} />
        </Suspense>
    )
}
export default TabPage