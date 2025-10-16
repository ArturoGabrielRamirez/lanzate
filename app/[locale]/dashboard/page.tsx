/* import { Rss } from "lucide-react" */
import { Metadata } from "next"
/* import { NextStepProvider } from "nextstepjs" */
import { Suspense } from "react"

import { WelcomeTutorial } from "@/features/dashboard/components"
import { WelcomeWidget } from "@/features/dashboard/components"
import { DashboardError } from "@/features/dashboard/components"
/* import AccountSetup from "@/features/dashboard/components/account-setup"
import AccountSetupSkeleton from "@/features/dashboard/components/account-setup-skeleton" */
import ActivityFeedSkeleton from "@/features/dashboard/components/activity-feed-skeleton"
import ActivityFeed from "@/features/dashboard/components/activity-items/activity-feed"
/* import DashboardCalendar from "@/features/dashboard/components/dashboard-calendar"
import DashboardStats from "@/features/dashboard/components/dashboard-stats"
import DashboardStatsSkeleton from "@/features/dashboard/components/dashboard-stats-skeleton"
import FeedFilters from "@/features/dashboard/components/feed-filters"
import HelpCard from "@/features/dashboard/components/help-card"
import QuickActions from "@/features/dashboard/components/quick-actions"
import QuickActionsSkeleton from "@/features/dashboard/components/quick-actions-skeleton" */
import { StoreListContainer } from "@/features/dashboard/components/store-list"
import { StoreListSkeleton } from "@/features/dashboard/components/store-list"
import { loadFeedParams } from "@/features/dashboard/utils/load-feed-params"
import { GlobalSearch } from "@/features/global-search/components"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { PageContainer } from "@/features/layout/components"
/* import NextStepContainer from "@/features/layout/components/next-step-container" */
import { redirect } from "@/i18n/naviation"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard",
}


export default async function Dashboard({ searchParams }: { searchParams: Promise<{ type: string }> }) {

    //const { category, sort, search, min, max, page, limit } = await loadFilterParams(searchParams)
    const { type, page } = await loadFeedParams(searchParams)

    const { payload: user, hasError, message } = await getUserInfo()

    if (!user) return redirect({ href: "/login", locale: "es" })

    if (hasError) {
        return (
            <PageContainer>
                <DashboardError message={message} />
            </PageContainer>
        )
    }

    return (
        <PageContainer className="gap-4 flex flex-col">
            <WelcomeWidget user={user} />
            <WelcomeTutorial />
            <Suspense>
                <GlobalSearch userId={user.id} />
            </Suspense>
            <Suspense fallback={<StoreListSkeleton />}>
                <StoreListContainer />
            </Suspense>
            <Suspense fallback={<ActivityFeedSkeleton />} key={type}>
                <ActivityFeed userId={user.id} type={type} page={page || 1} />
            </Suspense>
            {/* <div className="grid grid-cols-1 grid-areas-[search-bar,actions,feed] md:grid-areas-[search-bar_stores,feed_stores,feed_actions,feed_calendar] gap-2 md:grid-cols-[2fr_1fr] md:grid-rows-[min-content_auto_min-content_1fr] lg:grid-areas-[stats_search-bar_stores,stats_feed_stores,stats_feed_actions,setup_feed_calendar,help_feed_calendar,empty_feed_calendar,empty_feed_calendar] lg:grid-rows-[min-content_min-content_min-content_min-content_min-content_1fr] lg:grid-cols-[1fr_2fr_1fr] md:gap-4 lg:gap-6 xl:gap-8">
                <Suspense fallback={<DashboardStatsSkeleton />}>
                    <DashboardStats userId={user.id} />
                </Suspense>
                <HelpCard />
                <Suspense fallback={<AccountSetupSkeleton />}>
                    <AccountSetup />
                </Suspense>
                <div className="flex gap-2 area-[search-bar] flex-col group/search-bar">
                    <div className="md:flex gap-2 mb-2 md:mb-4 hidden text-primary/50 group-hover/search-bar:text-primary transition-all justify-between items-end">
                        <div className="flex items-center gap-2">
                            <Rss className="size-4 xl:size-5" />
                            <h2 className="text-lg lg:text-2xl font-bold leading-6 ">
                                Your feed
                            </h2>
                        </div>
                        <FeedFilters />
                    </div>
                    
                </div>
                
                <Suspense fallback={<QuickActionsSkeleton />}>
                    <QuickActions userId={user.id} />
                </Suspense>
                
                <Suspense fallback={<div className="area-[calendar] hidden md:block group" />}>
                    <DashboardCalendar />
                </Suspense>
            </div> */}
        </PageContainer>
    )
}