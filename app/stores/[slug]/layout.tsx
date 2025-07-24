import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"

import { TabTriggerLink, TabsClientContainer } from "@/features/stores/components"
import { Card, CardContent } from "@/components/ui/card"
import { Title } from "@/features/layout/components"
import { TabsList } from "@/components/ui/tabs"

import { StoreDetailsLayoutProps } from "@/features/stores/types"
import { Box, Building2, ChartLine, Clock, Settings, ShoppingCart, UsersRound } from "lucide-react"
import { Store } from "lucide-react"
import { BookOpenText } from "lucide-react"


async function StoreDetailsLayout({ children, params }: StoreDetailsLayoutProps) {

    const { slug } = await params

    const { payload: store, error } = await getStoresFromSlug(slug)

    if (error || !store) {
        return console.log(error)
    }

    return (
        <div className="p-4 grow flex flex-col pt-24 pb-12">
            <Title title="Store Details" />
            <section className="flex items-center gap-4">
                <Card className="w-full">
                    <CardContent className="flex md:items-center gap-4 w-full justify-between flex-col xs:flex-row">
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
                    <TabsList className="w-full h-full items-start max-md:bg-transparent">
                        <div className="flex md:block w-full fixed bottom-0 md:relative bg-accent z-10 overflow-x-auto md:h-full">
                            <TabTriggerLink value="overview" text="Overview" slug={slug} icon={<BookOpenText className="w-4 h-4" />}/>
                            <TabTriggerLink value="account" text="Store Details" slug={slug} icon={<Store className="w-4 h-4" />} />
                            <TabTriggerLink value="branches" text="Branches" slug={slug} icon={<Building2 className="w-4 h-4" />} />
                            <TabTriggerLink value="employees" text="Employees" slug={slug} icon={<UsersRound className="w-4 h-4" />} />
                            <TabTriggerLink value="products" text="Products" slug={slug} icon={<Box className="w-4 h-4" />} />
                            <TabTriggerLink value="orders" text="Orders" slug={slug} icon={<ShoppingCart className="w-4 h-4" />} />
                            <TabTriggerLink value="settings" text="Settings" slug={slug} icon={<Settings className="w-4 h-4" />} />
                            <TabTriggerLink value="analytics" text="Analytics" slug={slug} icon={<ChartLine className="w-4 h-4" />} />
                            <TabTriggerLink value="history" text="History" slug={slug} icon={<Clock className="w-4 h-4" />} />
                        </div>
                    </TabsList>
                    {children}
                </TabsClientContainer>
            </section>
        </div>
    )
}
export default StoreDetailsLayout