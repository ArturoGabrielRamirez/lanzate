import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateProductButton from "@/features/products/components/create-product-button"
import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"
import Title from "@/features/layout/components/title"

type Props = {
    params: Promise<{ slug: string }>
}

async function StoreDetailsPage({ params }: Props) {

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
                <Tabs defaultValue="account" className="grid grid-cols-1 md:grid-cols-[300px_1fr] grid-rows-[auto_1fr] md:grid-rows-[1fr] w-full md:gap-4">
                    <TabsList className="w-full h-full items-start">
                        <div className="flex md:block w-full">
                            <TabsTrigger value="account" className="w-full h-fit cursor-pointer py-3">Store Details</TabsTrigger>
                            <TabsTrigger value="branches" className="w-full h-fit cursor-pointer py-3">Branches</TabsTrigger>
                            <TabsTrigger value="employees" className="w-full h-fit cursor-pointer py-3">Employees</TabsTrigger>
                            <TabsTrigger value="products" className="w-full h-fit cursor-pointer py-3">Products</TabsTrigger>
                            <TabsTrigger value="orders" className="w-full h-fit cursor-pointer py-3">Orders</TabsTrigger>
                            <TabsTrigger value="settings" className="w-full h-fit cursor-pointer py-3">Settings</TabsTrigger>
                            <TabsTrigger value="analytics" className="w-full h-fit cursor-pointer py-3">Analytics</TabsTrigger>
                        </div>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 w-fit">
                                <div className="flex flex-col">
                                    <p className="font-light text-sm">Name</p>
                                    <p className="font-medium">{store.name}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-light text-sm">Description</p>
                                    <p className="font-medium">{store.description || "No description available"}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-light text-sm">Email</p>
                                    <p className="font-medium">{store.email || "No email available"}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-light text-sm">Phone</p>
                                    <p className="font-medium">{store.phone || "No phone available"}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="products">
                        <Card>
                            <CardHeader>
                                <CardTitle>Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CreateProductButton />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="employees">
                        <Card>
                            <CardHeader>
                                <CardTitle>Employees</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Currently not available
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="branches">
                        <Card>
                            <CardHeader>
                                <CardTitle>Branches</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Currently not available
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="orders">
                        <Card>
                            <CardHeader>
                                <CardTitle>Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Currently not available
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Currently not available
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="analytics">
                        <Card>
                            <CardHeader>
                                <CardTitle>Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Currently not available
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </section>
        </div>
    )
}
export default StoreDetailsPage