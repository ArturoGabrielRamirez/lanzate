import { BookOpenText, Building2, UsersRound, Box, Store, ShoppingCart, Settings, ChartLine, Clock, Paintbrush } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { PageHeader } from "@/features/layout/components"
import { TabLayoutProps } from "@/features/stores/types"

async function TabLayout({ children, params }: TabLayoutProps) {

    const { tab } = await params
    const t = await getTranslations("store.tabs")

    const titles = {
        overview: <><BookOpenText className="size-8" />{t("overview")}</>,
        account: <><Store className="size-8" />{t("account")}</>,
        branches: <><Building2 className="size-8" />{t("branches")}</>,
        employees: <><UsersRound className="size-8" />{t("employees")}</>,
        products: <><Box className="size-8" />{t("products")}</>,
        orders: <><ShoppingCart className="size-8" />{t("orders")}</>,
        settings: <><Settings className="size-8" />{t("settings")}</>,
        analytics: <><ChartLine className="size-8" />{t("analytics")}</>,
        history: <><Clock className="size-8" />{t("history")}</>,
        styles: <><Paintbrush className="size-8" />{t("styles")}</>,
    }

    return (
        <>
            <PageHeader title={titles[tab as keyof typeof titles]} />
            {children}
        </>
    )
}

export default TabLayout