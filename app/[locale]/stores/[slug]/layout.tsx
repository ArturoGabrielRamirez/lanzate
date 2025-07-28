import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"

import { TabTriggerLink, TabsClientContainer } from "@/features/stores/components"
import { Card, CardContent } from "@/components/ui/card"
import { Title } from "@/features/layout/components"
import { TabsList } from "@/components/ui/tabs"

import { StoreDetailsLayoutProps } from "@/features/stores/types"
import { Box, Building2, ChartLine, Clock, Settings, ShoppingCart, UsersRound } from "lucide-react"
import { Store } from "lucide-react"
import { BookOpenText } from "lucide-react"
import { getTranslations } from "next-intl/server"


async function StoreDetailsLayout({ children, params }: StoreDetailsLayoutProps) {

    const { slug } = await params

    const { payload: store, error } = await getStoresFromSlug(slug)

    if (error || !store) {
        return console.log(error)
    }

    const t = await getTranslations("store.layout")
    const t2 = await getTranslations("store")

    return (
        <div className="flex flex-col p-4 grow max-md:pt-24 max-md:pb-12">
            <Title
                title={(
                    <div className="flex items-center gap-2">
                        <Store />
                        {t2("store-details")}
                    </div>
                )}
                breadcrumbs={[
                    {
                        label: t2("plural-title"),
                        href: "/stores"
                    },
                    {
                        label: store.name,
                        href: `/stores/${slug}`
                    }
                ]}
            />
            <section className="flex items-center gap-4">
                <Card className="w-full">
                    <CardContent className="flex flex-col justify-between w-full gap-4 md:items-center xs:flex-row">
                        <div className="flex items-center gap-4">
                            <img
                                src={`https://api.dicebear.com/9.x/initials/svg?seed=${store.name}`}
                                alt="User avatar"
                                className="rounded-full size-24"
                            />
                            <div className="flex flex-col gap-2">
                                <p className="text-xl font-bold">{store.name}</p>
                                <div>
                                    <p className="capitalize text-muted-foreground">
                                        {store.description || t("no-description")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>{t2("current-balance")}</p>
                            <p className="text-lg font-bold lg:text-2xl">{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(store.balance.current_balance)}</p>
                        </div>
                    </CardContent>
                </Card>
            </section>
            <section className="flex py-4 grow">
                <TabsClientContainer>
                    <TabsList className="items-start w-full h-full max-md:bg-transparent">
                        <div className="fixed bottom-0 z-10 flex w-full overflow-x-auto md:block md:relative bg-accent md:h-full">
                            <TabTriggerLink value="overview" text={t("overview")} slug={slug} icon={<BookOpenText className="w-4 h-4" />} />
                            <TabTriggerLink value="account" text={t("account-details")} slug={slug} icon={<Store className="w-4 h-4" />} />
                            <TabTriggerLink value="branches" text={t("branches")} slug={slug} icon={<Building2 className="w-4 h-4" />} />
                            <TabTriggerLink value="employees" text={t("employees")} slug={slug} icon={<UsersRound className="w-4 h-4" />} />
                            <TabTriggerLink value="products" text={t("products")} slug={slug} icon={<Box className="w-4 h-4" />} />
                            <TabTriggerLink value="orders" text={t("orders")} slug={slug} icon={<ShoppingCart className="w-4 h-4" />} />
                            <TabTriggerLink value="settings" text={t("settings")} slug={slug} icon={<Settings className="w-4 h-4" />} />
                            <TabTriggerLink value="analytics" text={t("analytics")} slug={slug} icon={<ChartLine className="w-4 h-4" />} />
                            <TabTriggerLink value="history" text={t("history")} slug={slug} icon={<Clock className="w-4 h-4" />} />
                        </div>
                    </TabsList>
                    {children}
                </TabsClientContainer>
            </section>
        </div>
    )
}
export default StoreDetailsLayout