import { Suspense } from "react"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { Calendar, Store } from "lucide-react"
import ActivityFeed from "@/features/dashboard/components/activity-feed"
import ActivityFeedSkeleton from "@/features/dashboard/components/activity-feed-skeleton"
import DashboardStats from "@/features/dashboard/components/dashboard-stats"
import DashboardStatsSkeleton from "@/features/dashboard/components/dashboard-stats-skeleton"
import GlobalSearch from "@/features/dashboard/components/global-search"
import { Button } from "@/components/ui/button"
import DashboardCalendar from "@/features/dashboard/components/dashboard-calendar"
import StoreListContainer from "@/features/dashboard/components/store-list-container"
import StoreList from "@/features/dashboard/components/store-list"

export default async function Dashboard() {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    return (
        <section className="p-2 md:p-4 flex flex-col pt-13 md:pt-17">
            <div className="grid grid-cols-1 grid-areas-[search-bar,actions,feed] md:grid-areas-[search-bar_stores,feed_stores,feed_actions,feed_calendar] gap-2 md:grid-cols-[2fr_1fr] md:grid-rows-[min-content_auto_min-content_1fr] lg:grid-areas-[stats_search-bar_stores,stats_feed_stores,stats_feed_actions,stats_feed_calendar,empty_feed_calendar,empty_feed_calendar] lg:grid-rows-[min-content_min-content_min-content_min-content_1fr] lg:grid-cols-[1fr_2fr_1fr] md:gap-4">
                {/* Quick Stats */}
                <Suspense fallback={<DashboardStatsSkeleton />}>
                    <DashboardStats userId={user.id} />
                </Suspense>

                {/* Search Bar */}
                <div className="  flex items-center gap-2 area-[search-bar]">
                    <GlobalSearch userId={user.id} />
                </div>

                {/* Activity Feed */}
                <div className="area-[feed]">
                    <Suspense fallback={<ActivityFeedSkeleton />}>
                        <ActivityFeed userId={user.id} />
                    </Suspense>
                </div>

                <div className="area-[actions] flex items-center gap-2">
                    <Button variant="outline" className="grow" size="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M21 15h-2.5a1.503 1.503 0 0 0-1.5 1.5a1.503 1.503 0 0 0 1.5 1.5h1a1.503 1.503 0 0 1 1.5 1.5a1.503 1.503 0 0 1-1.5 1.5H17m2 0v1m0-8v1m-6 6H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2m12 3.12V9a2 2 0 0 0-2-2h-2"></path><path d="M16 10V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6m8 0H8m8 0h1m-9 0H7m1 4v.01M8 17v.01m4-3.02V14m0 3v.01"></path></g></svg>
                    </Button>
                    <Button variant="outline" className="grow" size="icon">
                        <Store className="size-4" />
                    </Button>
                    <Button variant="outline" className="grow md:hidden" size="icon">
                        <Calendar className="size-4" />
                    </Button>
                </div>

                {/* Store Management Section */}
                <StoreListContainer>
                    <Suspense fallback={<div>Loading...</div>}>
                        <StoreList />
                    </Suspense>
                </StoreListContainer>

                {/* Calendar */}
                <div className="area-[calendar] opacity-50 hover:opacity-100 transition-opacity duration-300 hidden md:block">
                    <DashboardCalendar />
                </div>

                {/* Create order button */}
                {/* <div className="">
                    <Button asChild>
                        <Link href="/sale">
                            Create Order
                        </Link>
                    </Button>
                </div> */}
            </div>
        </section >
    )
}