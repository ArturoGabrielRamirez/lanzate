/* import { Box, Building2, ChartLine, Clock, Paintbrush, ShoppingCart, UsersRound } from "lucide-react" */
/* import { Store } from "lucide-react" */
/* import { BookOpenText } from "lucide-react" */
import { getTranslations } from "next-intl/server"

/* import { TabsList } from "@/components/ui/tabs" */
/* import { TabTriggerLink, TabsClientContainer } from "@/features/stores/components" */
/* import { StoreHeaderServer } from "@/features/stores/components/store-header-server" */
import { getUserInfo } from "@/features/layout/actions"
import { PageContainer } from "@/features/layout/components"
import { getStoreBasicsBySlugAction } from "@/features/stores/actions"
import { StoreDetailsLayoutProps } from "@/features/stores/types"
import { redirect } from "@/i18n/naviation"


async function StoreDetailsLayout({ children, params }: StoreDetailsLayoutProps) {

    const { slug } = await params

    const t = await getTranslations("store.layout")

    const { payload: user, hasError: userError } = await getUserInfo()

    if (!user) return redirect({ href: "/login", locale: "es" })

    if (userError) {
        //return <DashboardError message={userMessage} />
        return null
    }

    const { payload: store, hasError: storeError } = await getStoreBasicsBySlugAction(slug)

    if (storeError) {
        return null
    }

    if (!store) {
        return redirect({ href: "/stores", locale: "es" })
    }

    return (
        <PageContainer className="gap-4 flex flex-col lg:gap-8">
            {children}
            {/* <TabsClientContainer>
                    <TabsList className="items-start w-full h-full max-md:bg-transparent p-0">
                        <div className="bottom-0 z-10 flex w-full overflow-x-auto md:block md:relative bg-accent md:h-full rounded-xl">
                            <TabTriggerLink value="overview" text={t("overview")} slug={slug} icon={<BookOpenText className="size-6 lg:size-4" />} />
                            <TabTriggerLink value="account" text={t("account-details")} slug={slug} icon={<Store className="size-6 lg:size-4" />} />
                            <TabTriggerLink value="branches" text={t("branches")} slug={slug} icon={<Building2 className="size-6 lg:size-4" />} />
                            <TabTriggerLink value="employees" text={t("employees")} slug={slug} icon={<UsersRound className="size-6 lg:size-4" />} />
                            <TabTriggerLink value="products" text={t("products")} slug={slug} icon={<Box className="size-6 lg:size-4" />} />
                            <TabTriggerLink value="orders" text={t("orders")} slug={slug} icon={<ShoppingCart className="size-6 lg:size-4" />} />
                            <TabTriggerLink value="styles" text={t("styles")} slug={slug} icon={<Paintbrush className="size-6 lg:size-4" />} />
                            <TabTriggerLink value="analytics" text={t("analytics")} slug={slug} icon={<ChartLine className="size-6 lg:size-4" />} />
                            <TabTriggerLink value="history" text={t("history")} slug={slug} icon={<Clock className="size-6 lg:size-4" />} />
                        </div>
                    </TabsList>
                    {children}
                </TabsClientContainer> */}
        </PageContainer>
    )
}
export default StoreDetailsLayout