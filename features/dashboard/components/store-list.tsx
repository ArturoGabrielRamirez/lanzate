import { getUserInfo } from "@/features/layout/actions"
import { getTranslations } from "next-intl/server"
import { getDashboardStores } from "../actions/getDashboardStores"
import { StoreCard } from "@/features/stores/components"
import Link from "next/link"
import { ArrowRight, Store } from "lucide-react"
import { CreateStoreButton } from "@/features/stores/components"

const StoreList = async () => {

    const t = await getTranslations("dashboard")

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        console.error(userMessage)
        return null
    }

    const { payload: dashboardData, error: dashboardError } = await getDashboardStores(user.id)

    if (dashboardError || !dashboardData) {
        console.error("Error loading dashboard data")
        return null
    }

    return (
        <>
            <div className="border-b md:border-b-0 pb-4 md:pb-0 area-[stores] opacity-50 hover:opacity-100 transition-opacity duration-300" id="step2">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                    <h2 className="text-lg lg:text-2xl font-bold leading-6 flex items-center gap-2">
                        <Store className="size-4 xl:size-5" />
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
                        {dashboardData.stores.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center gap-2">
                                <p className="text-center text-sm text-muted-foreground">
                                    No stores found
                                </p>
                                <CreateStoreButton userId={user.id} />
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    )
}

export default StoreList