import { Suspense } from "react"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { Rss } from "lucide-react"
import ActivityFeed from "@/features/dashboard/components/activity-feed"
import ActivityFeedSkeleton from "@/features/dashboard/components/activity-feed-skeleton"
import DashboardStats from "@/features/dashboard/components/dashboard-stats"
import DashboardStatsSkeleton from "@/features/dashboard/components/dashboard-stats-skeleton"
import GlobalSearch from "@/features/dashboard/components/global-search"
import DashboardCalendar from "@/features/dashboard/components/dashboard-calendar"
import { DotPattern } from "@/components/magicui/dot-pattern"
import { cn } from "@/lib/utils"
import StoreListContainer from "@/features/dashboard/components/store-list-container"
import StoreList from "@/features/dashboard/components/store-list"
import StoreListSkeleton from "@/features/dashboard/components/store-list-skeleton"
import QuickActions from "@/features/dashboard/components/quick-actions"
import QuickActionsSkeleton from "@/features/dashboard/components/quick-actions-skeleton"

export default async function Dashboard() {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    return (
        <section className="p-2 md:p-4 flex flex-col pt-13 md:pt-17 relative">
            <div className="grid grid-cols-1 grid-areas-[search-bar,actions,feed] md:grid-areas-[search-bar_stores,feed_stores,feed_actions,feed_calendar] gap-2 md:grid-cols-[2fr_1fr] md:grid-rows-[min-content_auto_min-content_1fr] lg:grid-areas-[stats_search-bar_stores,stats_feed_stores,stats_feed_actions,stats_feed_calendar,empty_feed_calendar,empty_feed_calendar] lg:grid-rows-[min-content_min-content_min-content_min-content_1fr] lg:grid-cols-[1fr_2fr_1fr] md:gap-4 lg:gap-6 xl:gap-8">
                {/* Quick Stats */}
                <Suspense fallback={<DashboardStatsSkeleton />}>
                    <DashboardStats userId={user.id} />
                </Suspense>

                {/* Search Bar */}
                <div className="flex gap-2 area-[search-bar] flex-col">
                    <div className="md:flex items-center gap-2 mb-2 md:mb-4 hidden text-muted-foreground/50">
                        <Rss className="size-4 xl:size-5" />
                        <h2 className="text-lg lg:text-2xl font-bold leading-6 ">
                            Your feed
                        </h2>
                    </div>
                    <GlobalSearch userId={user.id} />
                </div>

                {/* Activity Feed */}
                <div className="area-[feed]" id="step1">
                    <Suspense fallback={<ActivityFeedSkeleton />}>
                        <ActivityFeed userId={user.id} />
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
                <div className="area-[calendar] hidden md:block" >
                    <DashboardCalendar />
                </div>

            </div>
            <DotPattern
                width={30}
                height={30}
                className={cn(
                    "[mask-image:linear-gradient(to_bottom_right,white,transparent_70%,transparent)] -z-10",
                )}
            />
        </section>
    )
}