import { getTranslations } from "next-intl/server"

import { SectionContainer } from "@/features/stores/components"
import { TabLayoutProps } from "@/features/stores/types"

async function TabLayout({ children, params }: TabLayoutProps) {

    const { tab } = await params
    const t = await getTranslations("store.tabs")

    const titles = {
        overview: t("overview"),
        account: t("account"),
        branches: t("branches"),
        employees: t("employees"),
        products: t("products"),
        orders: t("orders"),
        settings: t("settings"),
        analytics: t("analytics"),
        history: t("history"),
        styles: t("styles"),
    }

    return (
        <SectionContainer title={titles[tab as keyof typeof titles]}>{children}</SectionContainer>
    )
}

export default TabLayout