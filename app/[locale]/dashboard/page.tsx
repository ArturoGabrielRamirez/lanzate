import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getDashboardStores } from "@/features/dashboard/actions/getDashboardStores"
import { checkUserOrderPermissions } from "@/features/dashboard/actions/checkUserOrderPermissions"
import { DashboardSteps, ActivityFeed, ActivityFeedSkeleton } from "@/features/dashboard/components"
import { Title } from "@/features/layout/components"
import { CreateStoreButton, StoreCard } from "@/features/stores/components"
import { ArrowRight, Hand, Plus, ShoppingBasket, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DashboardCalendar from "@/features/dashboard/components/dashboard-calendar"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard"
}

async function DashboardPage() {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: dashboardData, error: dashboardError } = await getDashboardStores(user.id)

    if (dashboardError || !dashboardData) {
        return console.error("Error loading dashboard data")
    }

    // Check if user has can_create_orders permission in any store
    let canCreateOrders = false
    
    if (dashboardData.storeCount > 0) {
        const { payload: hasOrderPermissions, error: permissionsError } = await checkUserOrderPermissions(user.id)
        
        if (!permissionsError) {
            canCreateOrders = hasOrderPermissions
        }
    }

    const t = await getTranslations("dashboard")

    return (
        <section className="p-4 flex flex-col pt-13 md:pt-17">
            <Title title={(
                <div className="flex items-center gap-2">
                    <Hand className="size-4 md:size-5 lg:size-6" />
                    {t("title")}
                </div>
            )} showDate className="hidden md:block" />

            <div className="grid grid-cols-1 
                            grid-areas-[steps,stores,coming-soon,calendar,order]
                           md:grid-areas-[order_steps,coming-soon_steps,coming-soon_stores,coming-soon_calendar] 
                           md:grid-cols-[1fr_minmax(auto,300px)] 
                           lg:grid-areas-[steps_coming-soon_order,steps_coming-soon_stores,calendar_coming-soon_stores,calendar_coming-soon_stores,empty_coming-soon_empty2] 
                           lg:grid-cols-[minmax(auto,300px)_1fr_minmax(auto,300px)] 
                           gap-4 mg:gap-3 lg:gap-4 lg:grid-rows-[min-content_auto_auto]">

                {/* Dashboard Steps */}
                <div className="area-steps md:area-[steps] lg:area-[steps]">
                    <DashboardSteps userId={user.id} dashboardData={dashboardData} />
                    {/* <div className="h-px bg-muted-foreground/20 my-2 md:my-4" /> */}
                </div>

                {/* Activity Feed */}
                <div className="area-[coming-soon] md:area-[coming-soon] lg:area-[coming-soon] md:pt-0">
                    <Suspense fallback={<ActivityFeedSkeleton />}>
                        <ActivityFeed userId={user.id} />
                    </Suspense>
                </div>

                {/* Store Management Section */}
                {dashboardData.storeCount > 0 && (
                    <div className="area-[stores] md:area-[stores] lg:area-[stores] border-t md:border-t-0 pt-2 md:pt-0 border-b md:border-b-0 pb-4 md:pb-0">
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
                <div className="md:area-[calendar] lg:area-[calendar]">
                    <DashboardCalendar />
                </div>

                {/* New Order Card - Hidden on mobile */}
                <Card className="md:area-[order] lg:area-[order] w-full h-fit hidden md:block">
                    <CardHeader>
                        <CardTitle>
                            <h2 className="text-2xl font-bold">{t("new-order.title")}</h2>
                        </CardTitle>
                        <CardDescription>
                            {t("new-order.description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {canCreateOrders ? (
                            <Button className="w-full" asChild>
                                <Link href="/sale">
                                    <ShoppingBasket />
                                    {t("new-order.title")}
                                </Link>
                            </Button>
                        ) : (
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    You don&apos;t have sufficient permissions to create orders. Please contact an administrator.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default DashboardPage