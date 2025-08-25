import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { TabLayoutProps } from "@/features/stores/types"
import { BookOpenText, Building2, UsersRound, Box, Store, ShoppingCart, Settings, ChartLine, Clock, Paintbrush } from "lucide-react"
import { getTranslations } from "next-intl/server"

async function TabLayout({ children, params }: TabLayoutProps) {

    const { tab } = await params
    const t = await getTranslations("store.tabs")

    const titles = {
        overview: <><BookOpenText className="w-4 h-4" />{t("overview")}</>,
        account: <><Store className="w-4 h-4" />{t("account")}</>,
        branches: <><Building2 className="w-4 h-4" />{t("branches")}</>,
        employees: <><UsersRound className="w-4 h-4" />{t("employees")}</>,
        products: <><Box className="w-4 h-4" />{t("products")}</>,
        orders: <><ShoppingCart className="w-4 h-4" />{t("orders")}</>,
        settings: <><Settings className="w-4 h-4" />{t("settings")}</>,
        analytics: <><ChartLine className="w-4 h-4" />{t("analytics")}</>,
        history: <><Clock className="w-4 h-4" />{t("history")}</>,
        styles: <><Paintbrush className="w-4 h-4" />{t("styles")}</>,
    }

    const content = {
        overview: { title: <><BookOpenText className="w-4 h-4" />{t("overview")}</>, hasCard: true },
        account: { title: <><Store className="w-4 h-4" />{t("account")}</>, hasCard: false },
        branches: { title: <><Building2 className="w-4 h-4" />{t("branches")}</>, hasCard: true },
        employees: { title: <><UsersRound className="w-4 h-4" />{t("employees")}</>, hasCard: true },
        products: { title: <><Box className="w-4 h-4" />{t("products")}</>, hasCard: true },
        orders: { title: <><ShoppingCart className="w-4 h-4" />{t("orders")}</>, hasCard: true },
        settings: { title: <><Settings className="w-4 h-4" />{t("settings")}</>, hasCard: true },
        analytics: { title: <><ChartLine className="w-4 h-4" />{t("analytics")}</>, hasCard: true },
        history: { title: <><Clock className="w-4 h-4" />{t("history")}</>, hasCard: true },
        styles: { title: <><Paintbrush className="w-4 h-4" />{t("styles")}</>, hasCard: true },
    }

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