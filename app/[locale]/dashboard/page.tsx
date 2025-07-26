import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getDashboardStores } from "@/features/dashboard/actions/getDashboardStores"
import { Title } from "@/features/layout/components"
import { CreateStoreButton, StoreCard } from "@/features/stores/components"
import { ArrowRight, ChevronRight, Hand, Settings, Share, Share2, ShoppingCart, Store, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Separator } from "@radix-ui/react-select"
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

    const hasStores = dashboardData.storeCount > 0

    const t = await getTranslations("dashboard")

    return (
        <section className="p-4 flex flex-col max-md:pt-24">
            <Title title={(
                <div className="flex items-center gap-2">
                    <Hand />
                    {t("title")}
                </div>
            )} />
            <div className="max-w-[1500px]">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-4">
                    {/* Step 1: Create Store */}
                    <Card className={cn(
                        "transition-all duration-200",
                        hasStores
                            ? "opacity-60 border-muted"
                            : "border-primary/20 shadow-md"
                    )}>
                        <CardHeader>
                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                <div className={cn(
                                    "rounded-md flex items-center justify-center aspect-square",
                                    hasStores
                                        ? "bg-muted"
                                        : "bg-primary/10"
                                )}>
                                    <Store className={cn(
                                        "size-8",
                                        hasStores
                                            ? "text-muted-foreground"
                                            : "text-primary"
                                    )} />
                                </div>
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <ArrowRight className="size-4" />
                                        <h2 className="font-normal text-sm">{t("step-1.title")}
                                        </h2>
                                        {hasStores && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓{t("step-1.complete")}</span>}
                                    </CardTitle>
                                    <CardDescription className="font-bold text-2xl text-accent-foreground">
                                        {t("step-1.create-a-new-store")}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className={cn(
                            hasStores
                                ? "text-muted-foreground/30"
                                : "text-muted-foreground/50"
                        )}>
                            {t("step-1.to-continue")}
                        </CardContent>
                        <CardFooter>
                            {!hasStores && <CreateStoreButton userId={user.id} />}
                            {hasStores && (
                                <p className="text-sm text-muted-foreground">
                                    {t("step-1.stores-created-1")}{dashboardData.storeCount} {t("step-1.stores-created-2")}{dashboardData.storeCount > 1 ? 's' : ''} {t("step-1.stores-created-3")}{dashboardData.storeCount > 1 ? 's' : ''}
                                </p>
                            )}
                        </CardFooter>
                    </Card>

                    {/* Step 2: Create Product */}
                    <Card className={cn(
                        "transition-all duration-200",
                        hasStores
                            ? "border-primary/20 shadow-md"
                            : "opacity-40 border-muted cursor-not-allowed"
                    )}>
                        <CardHeader>
                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                <div className={cn(
                                    "rounded-md flex items-center justify-center aspect-square",
                                    hasStores
                                        ? "bg-primary/10"
                                        : "bg-muted"
                                )}>
                                    <ShoppingCart className={cn(
                                        "size-8",
                                        hasStores
                                            ? "text-primary"
                                            : "text-muted-foreground"
                                    )} />
                                </div>
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <ArrowRight className="size-4" />
                                        <h2 className="font-normal text-sm">{t("step-2.title")}</h2>
                                        {hasStores && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{t("step-2.available")}</span>}
                                    </CardTitle>
                                    <CardDescription className="font-bold text-2xl text-accent-foreground">
                                        {t("step-2.create-a-product")}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className={cn(
                            hasStores
                                ? "text-muted-foreground/50"
                                : "text-muted-foreground/30"
                        )}>
                            {t("step-2.to-continue")}
                            {!hasStores && (
                                <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                                    {t("step-2.first-complete")}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Step 3: Set up account */}
                    <Card className={cn(
                        "transition-all duration-200",
                        "opacity-40 border-muted cursor-not-allowed"
                    )}>
                        <CardHeader>
                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                <div className="bg-muted rounded-md flex items-center justify-center aspect-square">
                                    <Settings className="size-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <ArrowRight className="size-4" />
                                        <h2 className="font-normal text-sm">{t("step-3.title")}</h2>
                                    </CardTitle>
                                    <CardDescription className="font-bold text-2xl text-accent-foreground">
                                        {t("step-3.setup-account")}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="text-muted-foreground/30">
                            {t("step-3.to-continue")}
                            <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                                {t("step-3.first-complete")}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step 4: Share store */}
                    <Card className={cn(
                        "transition-all duration-200",
                        "opacity-40 border-muted cursor-not-allowed"
                    )}>
                        <CardHeader>
                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                <div className="bg-muted rounded-md flex items-center justify-center aspect-square">
                                    <Share2 className="size-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <ArrowRight className="size-4" />
                                        <h2 className="font-normal text-sm">{t("step-4.title")}</h2>
                                    </CardTitle>
                                    <CardDescription className="font-bold text-2xl text-accent-foreground">
                                        {t("step-4.share-your-store")}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="text-muted-foreground/30">
                            {t("step-4.share-your-store-with")}
                            <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                                {t("step-4.first-complete")}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="h-px bg-muted-foreground/20 my-4" />
                {dashboardData.storeCount > 0 && (
                    <div className="">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">{t("your-store.title")} ({dashboardData.storeCount})</h2>
                            <Link
                                href="/stores"
                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {t("your-store.see-all")}
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                        <section className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4">
                            <Card className="border-dashed">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus />
                                        <h2 className="text-2xl font-bold">{t("your-store.new-store")}</h2>
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
        </section>
    )
}

export default DashboardPage