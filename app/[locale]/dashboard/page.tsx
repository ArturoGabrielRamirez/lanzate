import { Suspense } from "react"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { Calendar, Store } from "lucide-react"
import ActivityFeed from "@/features/dashboard/components/activity-feed"
import ActivityFeedSkeleton from "@/features/dashboard/components/activity-feed-skeleton"
import GlobalSearch from "@/features/dashboard/components/global-search"
import { Button } from "@/components/ui/button"

export default async function Dashboard() {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }


    return (
        <section className="p-2 md:p-4 flex flex-col pt-13 md:pt-17">
            {/* Main Title */}
            {/* <div className="mb-2 md:mb-3 lg:mb-4">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight hidden md:block">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! <span className="hidden xl:inline">Here&apos;s what&apos;s happening with your store.</span>
                </p>
            </div> */}

            {/* <div className="grid grid-cols-1 grid-areas-[stores,search-bar,feed,quick-stats,steps,calendar] md:grid-areas-[stores_quick-stats,search-bar_search-bar,feed_feed,steps_calendar] lg:grid-areas-[search-bar_stores,feed_stores,feed_quick-stats,feed_steps,feed_calendar] lg:grid-cols-[1fr_35%] xl:grid-areas-[quick-stats_quick-stats_stores_stores,search-bar_search-bar_stores_stores,feed_feed_stores_stores,feed_feed_steps_steps,feed_feed_calendar_calendar,feed_feed_empty_empty] xl:grid-cols-[2fr_1fr_1fr_1fr] 2xl:grid-cols-[1fr_1fr_3fr_4fr_1fr_1fr] 3xl:grid-cols-[1fr_1fr_3fr_3fr_2fr_1fr] 2xl:grid-areas-[quick-stats_quick-stats_search-bar_search-bar_stores_stores,quick-stats_quick-stats_feed_feed_stores_stores,calendar_calendar_feed_feed_steps_steps] gap-4"> */}
            <div className="grid grid-cols-1 grid-areas-[search-bar,actions,feed] gap-2 md:gap-4">
                {/* Quick Stats */}
                {/* <div className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-2 gap-4 area-[quick-stats] opacity-50 hover:opacity-100 transition-opacity duration-300">
                    <Card className="!p-2 !gap-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 !px-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="!px-2">
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="text-xs text-muted-foreground">
                                <ArrowUp className="h-3 w-3 inline mr-1 text-green-500" />
                                +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="!p-2 !gap-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 !px-2">
                            <CardTitle className="text-sm font-medium">Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="!px-2">
                            <div className="text-2xl font-bold">+2350</div>
                            <p className="text-xs text-muted-foreground">
                                <ArrowUp className="h-3 w-3 inline mr-1 text-green-500" />
                                +180.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="!p-2 !gap-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 !px-2">
                            <CardTitle className="text-sm font-medium">Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="!px-2">
                            <div className="text-2xl font-bold">+12,234</div>
                            <p className="text-xs text-muted-foreground">
                                <ArrowDown className="h-3 w-3 inline mr-1 text-red-500" />
                                -19% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="!p-2 !gap-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 !px-2">
                            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="!px-2">
                            <div className="text-2xl font-bold">+573</div>
                            <p className="text-xs text-muted-foreground">
                                <ArrowUp className="h-3 w-3 inline mr-1 text-green-500" />
                                +201 since last hour
                            </p>
                        </CardContent>
                    </Card>
                </div> */}

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
                    <Button variant="outline" className="grow" size="icon">
                        <Calendar className="size-4" />
                    </Button>
                </div>

                {/* Store Steps */}
                {/* <div className="area-[steps] opacity-50 hover:opacity-100 transition-opacity duration-300">
                    <DashboardSteps userId={user.id} dashboardData={dashboardData} />
                </div> */}

                {/* Store Management Section */}
                {/* {dashboardData.storeCount > 0 && (
                    <div className="border-b md:border-b-0 pb-4 md:pb-0 area-[stores] opacity-50 hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-bold leading-6">
                                {t("your-stores.title", { count: dashboardData.storeCount })}
                            </h2>
                            <Link
                                href="/stores"
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t("your-stores.see-all")}
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                        <section >
                            <div className="sm:hidden mb-3">
                                <CreateStoreButton userId={user.id} />
                            </div>
                            <div className="md:grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4 flex overflow-x-auto md:overflow-x-visible">
                                {dashboardData.stores.map((store) => (
                                    <StoreCard key={store.id} store={store} />
                                ))}
                                <Card className="border-dashed gap-2 md:gap-3 lg:gap-4 hidden sm:block shrink-0 bg-transparent">
                                    <CardContent className="flex justify-center items-center grow flex-col">
                                        <h3 className="text-sm font-medium">Empty</h3>
                                        <p className="text-xs text-muted-foreground">Create a new store to get started</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>
                    </div>
                )} */}

                {/* Calendar */}
                {/* <div className="area-[calendar] opacity-50 hover:opacity-100 transition-opacity duration-300">
                    <DashboardCalendar />
                </div> */}

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