import { Suspense } from "react"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { Rss } from "lucide-react"
import ActivityFeed from "@/features/dashboard/components/activity-feed"
import ActivityFeedSkeleton from "@/features/dashboard/components/activity-feed-skeleton"
import DashboardStats from "@/features/dashboard/components/dashboard-stats"
import DashboardStatsSkeleton from "@/features/dashboard/components/dashboard-stats-skeleton"
import GlobalSearch from "@/features/dashboard/components/global-search"
import DashboardCalendar from "@/features/dashboard/components/dashboard-calendar"
import StoreListContainer from "@/features/dashboard/components/store-list-container"
import StoreList from "@/features/dashboard/components/store-list"
import StoreListSkeleton from "@/features/dashboard/components/store-list-skeleton"
import QuickActions from "@/features/dashboard/components/quick-actions"
import QuickActionsSkeleton from "@/features/dashboard/components/quick-actions-skeleton"
import { NextStepProvider } from "nextstepjs"
import NextStepContainer from "@/features/layout/components/next-step-container"
import FeedFilters from "@/features/dashboard/components/feed-filters"
import { loadFeedParams } from "@/features/dashboard/utils/load-feed-params"
import HelpCard from "@/features/dashboard/components/help-card"
import AccountSetup from "@/features/dashboard/components/account-setup"

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ type: string }> }) {

    //const { category, sort, search, min, max, page, limit } = await loadFilterParams(searchParams)
    const { type, page } = await loadFeedParams(searchParams)


    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }



    return (
        <section className="p-2 md:p-4 xl:px-0 flex flex-col pt-13 md:pt-24 relative pb-20 container mx-auto z-10">
            <NextStepProvider>
                <NextStepContainer>
                    <div className="grid grid-cols-1 grid-areas-[search-bar,actions,feed] md:grid-areas-[search-bar_stores,feed_stores,feed_actions,feed_calendar] gap-2 md:grid-cols-[2fr_1fr] md:grid-rows-[min-content_auto_min-content_1fr] lg:grid-areas-[stats_search-bar_stores,stats_feed_stores,setup_feed_stores,setup_feed_actions,setup_feed_calendar,help_feed_calendar,empty_feed_calendar,empty_feed_calendar] lg:grid-rows-[min-content_min-content_min-content_min-content_min-content_1fr] lg:grid-cols-[1fr_2fr_1fr] md:gap-4 lg:gap-6 xl:gap-8">

                        {/* Quick Stats */}
                        <Suspense fallback={<DashboardStatsSkeleton />}>
                            <DashboardStats userId={user.id} />
                        </Suspense>

                        {/* Help Card */}
                        <HelpCard />

                        {/* Account Setup */}
                        <Suspense fallback={<div className="area-[setup] hidden lg:block group/setup" />}>
                            <AccountSetup />
                        </Suspense>

                        {/* Search Bar */}
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
                            <Suspense>
                                <GlobalSearch userId={user.id} />
                            </Suspense>
                        </div>

                        {/* Activity Feed */}
                        <div className="area-[feed] group/search-bar" id="step1">
                            <Suspense fallback={<ActivityFeedSkeleton />} key={type}>
                                <ActivityFeed userId={user.id} type={type} page={page || 1} />
                            </Suspense>
                        </div>

                        {/* Quick Actions */}
                        <Suspense fallback={<QuickActionsSkeleton />}>
                            <QuickActions userId={user.id} />
                        </Suspense>

                        {/* Store Management Section */}
                        <StoreListContainer>
                            <Suspense fallback={<StoreListSkeleton />}>
                                <StoreList />
                            </Suspense>
                        </StoreListContainer>

                        {/* Calendar */}
                        <Suspense fallback={<div className="area-[calendar] hidden md:block group" />}>
                            <DashboardCalendar />
                        </Suspense>
                    </div>
                </NextStepContainer>
            </NextStepProvider>
        </section>
    )
}