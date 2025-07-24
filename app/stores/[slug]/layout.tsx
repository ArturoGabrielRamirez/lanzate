import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"

import { TabTriggerLink, TabsClientContainer } from "@/features/stores/components"
import { Card, CardContent } from "@/components/ui/card"
import { Title } from "@/features/layout/components"
import { TabsList } from "@/components/ui/tabs"

import { StoreDetailsLayoutProps } from "@/features/stores/types"


async function StoreDetailsLayout({ children, params }: StoreDetailsLayoutProps) {

    const { slug } = await params

    const { payload: store, error } = await getStoresFromSlug(slug)

    if (error || !store) {
        return console.log(error)
    }

    return (
        <div className="p-4 grow flex flex-col">
            <Title title="Store Details" />
            <section className="flex items-center gap-4">
                <Card className="w-full">
                    <CardContent className="flex items-center gap-4 w-full justify-between flex-col sm:flex-row">
                        <div className="flex items-center gap-4">
                            <img
                                src={`https://api.dicebear.com/9.x/initials/svg?seed=${store.name}`}
                                alt="User avatar"
                                className="size-24 rounded-full"
                            />
                            <div className="flex flex-col gap-2">
                                <p className="text-xl font-bold">{store.name}</p>
                                <div>
                                    <p className="capitalize text-muted-foreground">
                                        {store.description || "No description available"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>Current Balance</p>
                            <p className="text-lg lg:text-2xl font-bold">{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(store.balance.current_balance)}</p>
                        </div>
                    </CardContent>
                </Card>
            </section>
            <section className="py-4 grow flex">
                <TabsClientContainer>
                    <TabsList className="w-full h-full items-start">
                        <div className="flex md:block w-full">
                            <TabTriggerLink value="overview" text="Overview" slug={slug} />
                            <TabTriggerLink value="account" text="Store Details" slug={slug} />
                            <TabTriggerLink value="branches" text="Branches" slug={slug} />
                            <TabTriggerLink value="employees" text="Employees" slug={slug} />
                            <TabTriggerLink value="products" text="Products" slug={slug} />
                            <TabTriggerLink value="orders" text="Orders" slug={slug} />
                            <TabTriggerLink value="settings" text="Settings" slug={slug} />
                            <TabTriggerLink value="analytics" text="Analytics" slug={slug} />
                            <TabTriggerLink value="history" text="History" slug={slug} />
                        </div>
                    </TabsList>
                    {children}
                </TabsClientContainer>
            </section>
        </div>
    )
}
export default StoreDetailsLayout