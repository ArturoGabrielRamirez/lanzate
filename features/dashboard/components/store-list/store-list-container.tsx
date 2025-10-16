import { ArrowRight, Store } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { getDashboardStoresAction } from "@/features/dashboard/actions"
import { StoreListError } from "@/features/dashboard/components"
import { StoreList } from "@/features/dashboard/components"
import { getUserInfo } from "@/features/layout/actions"
import { redirect } from "@/i18n/naviation"

async function StoreListContainer() {
    const t = await getTranslations("dashboard")

    const { payload: user, hasError: userError } = await getUserInfo()

    if (!user) return redirect({ href: "/login", locale: "es" })

    if (userError) {
        return <StoreListError />
    }

    const { payload: dashboardData, hasError: dashboardError } = await getDashboardStoresAction(user.id, 2)

    if (dashboardError || !dashboardData) {
        return <StoreListError />
    }

    return (
        <section className="border-b md:border-b-0 pb-4 md:pb-0 area-[stores] group/stores" id="step2">
            <div className="flex items-center justify-between mb-2 md:mb-4 text-primary/50 group-hover/stores:text-primary transition-all">
                <h2 className="text-lg lg:text-2xl font-bold leading-6 flex items-center gap-2">
                    <Store className="size-4 xl:size-5" />
                    {t("your-stores.title", { count: dashboardData.storeCount })}
                </h2>
                <Link href="/stores" className="flex items-center gap-1 text-sm text-inherit hover:text-primary transition-colors">
                    {t("your-stores.see-all")}
                    <ArrowRight className="size-4" />
                </Link>
            </div>
            <StoreList
                stores={dashboardData.stores}
                userId={user.id}
            />
        </section>
    )
}

export { StoreListContainer }
