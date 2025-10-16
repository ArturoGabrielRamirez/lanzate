import { TabTriggerLink, TabsClientContainer, StoreHeaderSkeleton } from "@/features/stores/components"
import { StoreDetailsLayoutProps } from "@/features/stores/types"
import { StoreHeaderServer } from "@/features/stores/components/store-header-server"
import { TabsList } from "@/components/ui/tabs"
import { Box, Building2, ChartLine, Clock, Paintbrush, ShoppingCart, UsersRound } from "lucide-react"
import { Store } from "lucide-react"
import { BookOpenText } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Suspense } from "react"

async function StoreDetailsLayout({ children, params }: StoreDetailsLayoutProps) {

    const { slug } = await params

    const t = await getTranslations("store.layout")

    return (
        <div className="flex flex-col p-2 md:p-4 grow pt-13 md:pt-24 relative pb-24 container mx-auto z-10 xl:px-0">
            <Suspense fallback={<StoreHeaderSkeleton />}>
                <StoreHeaderServer slug={slug} />
            </Suspense>
            <section className="flex py-0 md:pt-4 grow">
                <TabsClientContainer>
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
                </TabsClientContainer>
            </section>
        </div>
    )
}
export default StoreDetailsLayout