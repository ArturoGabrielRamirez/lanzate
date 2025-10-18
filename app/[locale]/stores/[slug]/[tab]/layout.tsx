import { BookOpenText, Building2, UsersRound, Box, Store, ShoppingCart, Settings, ChartLine, Clock, Paintbrush, ArrowLeft } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
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

    const content = {
        overview: { title: <><BookOpenText className="size-8" />{t("overview")}</>, hasCard: true },
        account: { title: <><Store className="size-8" />{t("account")}</>, hasCard: false },
        branches: { title: <><Building2 className="size-8" />{t("branches")}</>, hasCard: true },
        employees: { title: <><UsersRound className="size-8" />{t("employees")}</>, hasCard: true },
        products: { title: <><Box className="size-8" />{t("products")}</>, hasCard: false },
        orders: { title: <><ShoppingCart className="size-8" />{t("orders")}</>, hasCard: true },
        settings: { title: <><Settings className="size-8" />{t("settings")}</>, hasCard: true },
        analytics: { title: <><ChartLine className="size-8" />{t("analytics")}</>, hasCard: true },
        history: { title: <><Clock className="size-8" />{t("history")}</>, hasCard: true },
        styles: { title: <><Paintbrush className="size-8" />{t("styles")}</>, hasCard: true },
    }

    return (
        <>
            <PageHeader title={titles[tab as keyof typeof titles]} />
            {children}
        </>
    )

    return (
        <TabsContent value={tab} className="flex flex-col">
            {content[tab as keyof typeof content].hasCard && (
                <Card className="grow !gap-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {titles[tab as keyof typeof titles]}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 grow">
                        {children}
                    </CardContent>
                </Card>
            )}
            {!content[tab as keyof typeof content].hasCard && (
                <>
                    {children}
                </>
            )}
        </TabsContent>
    )
}

export default TabLayout