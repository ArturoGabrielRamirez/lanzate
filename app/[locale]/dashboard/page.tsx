import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getDashboardStores } from "@/features/dashboard/actions/getDashboardStores"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, ArrowDown, ArrowRight, ArrowUp, DollarSign, Package, Plus, ShoppingBasket, ShoppingCart, Users } from "lucide-react"
import Link from "next/link"
import ActivityFeed from "@/features/dashboard/components/activity-feed"
import DashboardSteps from "@/features/dashboard/components/dashboard-steps"
import GlobalSearch from "@/features/dashboard/components/global-search"
import { AlertDescription } from "@/components/ui/alert"
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { checkUserOrderPermissions } from "@/features/dashboard/actions/checkUserOrderPermissions"
import { getTranslations } from "next-intl/server"
import { CreateStoreButton } from "@/features/stores/components"
import DashboardCalendar from "@/features/dashboard/components/dashboard-calendar"
import { StoreCard } from "@/features/stores/components"

function ActivityFeedSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default async function Dashboard() {

    const t = await getTranslations("dashboard")


    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: dashboardData, error: dashboardError } = await getDashboardStores(user.id)

    if (dashboardError || !dashboardData) {
        return console.error("Error loading dashboard data")
    }

    let canCreateOrders = false

    if (dashboardData.storeCount > 0) {
        const { payload: hasOrderPermissions, error: permissionsError } = await checkUserOrderPermissions(user.id)

        if (!permissionsError) {
            canCreateOrders = hasOrderPermissions
        }
    }


    return (
        <section className="p-4 flex flex-col pt-13 md:pt-17">
            {/* Main Title */}
            <div className="mb-2 md:mb-3 lg:mb-4">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight hidden md:block">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! <span className="hidden xl:inline">Here&apos;s what&apos;s happening with your store.</span>
                </p>
            </div>

            <div className="grid grid-cols-1 grid-areas-[stores,search-bar,feed,quick-stats,steps,calendar] md:grid-areas-[stores_quick-stats,search-bar_search-bar,feed_feed,steps_calendar] lg:grid-areas-[search-bar_stores,feed_stores,feed_quick-stats,feed_steps,feed_calendar] lg:grid-cols-[1fr_35%] xl:grid-areas-[quick-stats_quick-stats_stores_stores,search-bar_search-bar_stores_stores,feed_feed_stores_stores,feed_feed_steps_steps,feed_feed_calendar_calendar,feed_feed_empty_empty] xl:grid-cols-[2fr_1fr_1fr_1fr] 2xl:grid-cols-[1fr_1fr_2fr_2fr_1fr_1fr] 2xl:grid-areas-[quick-stats_quick-stats_search-bar_search-bar_stores_stores,quick-stats_quick-stats_feed_feed_stores_stores,calendar_calendar_feed_feed_steps_steps] gap-4">
                {/* Quick Stats */}
                <div className="  grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-2 gap-4 area-[quick-stats]">
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
                </div>

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

                {/* Store Steps */}
                <div className="area-[steps]">
                    <DashboardSteps userId={user.id} dashboardData={dashboardData} />
                </div>

                {/* Store Management Section */}
                {dashboardData.storeCount > 0 && (
                    <div className="border-b md:border-b-0 pb-4 md:pb-0 area-[stores]">
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
                                <Card className="border-dashed gap-2 md:gap-3 lg:gap-4 hidden sm:block shrink-0">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Plus className="size-4 md:size-5 lg:size-6" />
                                            <h2 className="text-lg md:text-xl lg:text-2xl font-bold">{t("your-stores.new-store")}</h2>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex justify-center items-center grow">
                                        <CreateStoreButton userId={user.id} />
                                    </CardContent>
                                </Card>
                                {dashboardData.stores.map((store) => (
                                    <StoreCard key={store.id} store={store} />
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* Calendar */}
                <div className="area-[calendar]">
                    <DashboardCalendar />
                </div>
            </div>
        </section >
    )
}