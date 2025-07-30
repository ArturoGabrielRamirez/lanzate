import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getDashboardStores } from "@/features/dashboard/actions/getDashboardStores"
import { DashboardSteps } from "@/features/dashboard/components"
import { Title } from "@/features/layout/components"
import { CreateStoreButton, StoreCard } from "@/features/stores/components"
import { ArrowRight, Hand, Plus, ShoppingBasket } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import DashboardCalendar from "@/features/dashboard/components/dashboard-calendar"
import { getTranslations } from "next-intl/server"

async function DashboardPage() {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: dashboardData, error: dashboardError } = await getDashboardStores(user.id)

    if (dashboardError || !dashboardData) {
        return console.error("Error loading dashboard data")
    }


    const t = await getTranslations("dashboard")

    return (
        <section className="p-4 flex flex-col pt-13 md:pt-17">
            <Title title={(
                <div className="flex items-center gap-2">
                    <Hand />
                    {t("title")}
                </div>
            )} showDate />

            <div className="grid md:grid-cols-[minmax(auto,300px)_1fr_minmax(auto,300px)] gap-4">
                <div className="max-w-[1500px] w-full">
                    {/* Dashboard Steps */}
                    <DashboardSteps userId={user.id} dashboardData={dashboardData} />

                    {/* Separator */}
                    <div className="h-px bg-muted-foreground/20 my-2 md:my-4" />

                    <DashboardCalendar />


                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <h2 className="text-2xl font-bold">Coming Soon</h2>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            This feature is coming soon.
                        </p>
                    </CardContent>
                </Card>
                <div className="flex flex-col">
                    <Card className="w-full h-fit">
                        <CardHeader>
                            <CardTitle>
                                <h2 className="text-2xl font-bold">{t("new-order.title")}</h2>
                            </CardTitle>
                            <CardDescription>
                                {t("new-order.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" asChild>
                                <Link href="/sale">
                                    <ShoppingBasket />
                                    {t("new-order.title")}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <div className="h-px bg-muted-foreground/20 my-2 md:my-4" />
                    {/* Store Management Section */}
                    {dashboardData.storeCount > 0 && (
                        <div className="">
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h2 className="text-xl md:text-2xl font-bold leading-tight">
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
                            <section className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4">
                                <div className="sm:hidden">
                                    <CreateStoreButton userId={user.id} />
                                </div>
                                <Card className="border-dashed gap-2 md:gap-3 lg:gap-4 hidden sm:block">
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
                            </section>
                        </div>
                    )}
                    
                </div>
            </div>
        </section>
    )
}

export default DashboardPage