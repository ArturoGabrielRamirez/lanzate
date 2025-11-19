import { lazy, Suspense } from "react"

import {AccountSkeleton} from "@/features/stores/components/tabs/account-skeleton"
import {AnalyticsSkeleton} from "@/features/stores/components/tabs/analytics-skeleton"
import {OverviewSkeleton} from "@/features/stores/components/tabs/overview-skeleton"
import {StylesSkeleton} from "@/features/stores/components/tabs/styles-skeleton"
import {TableSkeleton} from "@/features/stores/components/tabs/table-skeleton"
import { TabPageProps } from "@/features/stores/types"

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
            case 'analytics':
                return AnalyticsSkeleton
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