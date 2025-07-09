import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateProductButton from "@/features/products/components/create-product-button"
import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"
import Title from "@/features/layout/components/title"
import { Box, House, Plus } from "lucide-react"
import DeleteStoreButton from "@/features/stores/components/delete-store-button"
import EditStoreButton from "@/features/stores/components/edit-store-button"
import TabTriggerLink from "@/features/stores/components/tab-trigger-link"
import { loadTabParams } from "@/features/stores/utils/load-tabs-params"
import type { SearchParams } from 'nuqs/server'
import ProductListDetail from "@/features/stores/components/product-list-detail"
import ProductDetail from "@/features/stores/components/product-detail"


type Props = {
    children: React.ReactNode
    params: Promise<{ slug: string }>
    searchParams: Promise<SearchParams>
}


async function StoreDetailsLayout({ children, params, searchParams }: Props) {

    const { slug } = await params
    const { tab } = await loadTabParams(searchParams)

    const { payload: store, error } = await getStoresFromSlug(slug)

    if (error || !store) {
        return console.log(error)
    }

    return (
        <div className="p-4 grow flex flex-col">
            <Title title="Store Details" />
            <section className="flex items-center gap-4">
                <Card className="w-full">
                    <CardContent className="flex items-center gap-4 w-full">
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
                    </CardContent>
                </Card>

            </section>
            <section className="py-4 grow flex">
                <Tabs defaultValue={tab} className="grid grid-cols-1 md:grid-cols-[300px_1fr] grid-rows-[auto_1fr] md:grid-rows-[1fr] w-full md:gap-4">
                    <TabsList className="w-full h-full items-start">
                        <div className="flex md:block w-full">
                            <TabTriggerLink value="account" text="Store Details" slug={slug} />
                            <TabTriggerLink value="branches" text="Branches" slug={slug} />
                            <TabTriggerLink value="employees" text="Employees" slug={slug} />
                            <TabTriggerLink value="products" text="Products" slug={slug} />
                            <TabTriggerLink value="orders" text="Orders" slug={slug} />
                            <TabTriggerLink value="settings" text="Settings" slug={slug} />
                            <TabTriggerLink value="analytics" text="Analytics" slug={slug} />
                        </div>
                    </TabsList>
                    {children}
                    {/* 
                    <TabsContent value="products">
                        <Card>
                            <CardHeader>
                                <CardTitle>Products</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4 items-start">
                                <ProductListDetail
                                    products={store.products}
                                    storeId={store.id}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                     */}
                </Tabs>
            </section>
        </div>
    )
}
export default StoreDetailsLayout