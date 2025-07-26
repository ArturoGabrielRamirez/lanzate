import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getDashboardStores } from "@/features/dashboard/actions/getDashboardStores"
import { DashboardSteps } from "@/features/dashboard/components"
import { Title } from "@/features/layout/components"
import { CreateStoreButton, StoreCard } from "@/features/stores/components"
import { ArrowRight, Hand, Plus, ShoppingBasket } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import DashboardCalendar from "@/features/dashboard/components/dashboard-calendar"

async function DashboardPage() {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: dashboardData, error: dashboardError, message } = await getDashboardStores(user.id)

    if (dashboardError || !dashboardData) {
        return console.error("Error loading dashboard data")
    }

    return (
        <section className="p-4 flex flex-col max-md:pt-24">
            <Title title={(
                <div className="flex items-center gap-2">
                    <Hand />
                    Welcome!
                </div>
            )} />

            <div className="grid md:grid-cols-[minmax(0,1500px)_auto] gap-4">
                <div className="max-w-[1500px] w-full">
                    {/* Dashboard Steps */}
                    <DashboardSteps userId={user.id} dashboardData={dashboardData} />

                    {/* Separator */}
                    <div className="h-px bg-muted-foreground/20 my-4" />

                    {/* Store Management Section */}
                    {dashboardData.storeCount > 0 && (
                        <div className="">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Your Stores ({dashboardData.storeCount})</h2>
                                <Link
                                    href="/stores"
                                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    ver todas
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                            <section className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4">
                                <Card className="border-dashed">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Plus />
                                            <h2 className="text-2xl font-bold">New store</h2>
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
                <div className="flex flex-col gap-4">
                    <Card className="w-full h-fit">
                        <CardHeader>
                            <CardTitle>
                                <h2 className="text-2xl font-bold">New order</h2>
                            </CardTitle>
                            <CardDescription>
                                Create a new order to start selling!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" asChild>
                                <Link href="/sale">
                                    <ShoppingBasket />
                                    New order
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <DashboardCalendar />
                </div>
            </div>
        </section>
    )
}

export default DashboardPage