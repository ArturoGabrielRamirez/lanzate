import { getTranslations } from "next-intl/server"

import { getDashboardStoresAction } from "@/features/dashboard/actions"
import { StoreListError } from "@/features/dashboard/components"
import { StoreList } from "@/features/dashboard/components"
import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { SectionContainer } from "@/features/stores/components"
import { redirect } from "@/i18n/naviation"

async function StoreListContainer({ storeCount = 2, mandatoryAddMore = false }: { storeCount?: number, mandatoryAddMore?: boolean }) {
    const t = await getTranslations("dashboard")

    const { payload: user, hasError: userError } = await getUserInfo()

    if (!user) return redirect({ href: "/login", locale: "es" })

    if (userError) {
        return <StoreListError />
    }

    const { payload: dashboardData, hasError: dashboardError } = await getDashboardStoresAction(user.id, storeCount)

    if (dashboardError || !dashboardData) {
        return <StoreListError />
    }

    return (
        <SectionContainer title={t("your-stores.title", { count: dashboardData.storeCount })} moreLink="/stores">
            <StoreList
                stores={dashboardData.stores}
                userId={user.id}
                mandatoryAddMore={mandatoryAddMore}
            />
        </SectionContainer>
    )
}

export { StoreListContainer }
