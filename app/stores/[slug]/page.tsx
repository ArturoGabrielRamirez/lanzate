import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateProductButton from "@/features/products/components/create-product-button"
import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"
import Title from "@/features/layout/components/title"
import { House } from "lucide-react"
import DeleteStoreButton from "@/features/stores/components/delete-store-button"
import EditStoreButton from "@/features/stores/components/edit-store-button"

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
                            <CardContent className="gap-4 flex flex-col">
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 w-fit">
                                    <div className="flex flex-col">
                                        <p className="font-light text-sm">Name</p>
                                        <p className="font-medium">{store.name}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-light text-sm">Description</p>
                                        <p className="font-medium">{store.description || "No description available"}</p>
                                    </div>
                                    <div>
                                        <EditStoreButton
                                            userId={store.user_id}
                                            slug={store.slug}
                                            store={store}
                                        />
                                    </div>
                                </section>
                                <section className="p-4 bg-destructive/10 border-destructive border rounded-md">
                                    <h2 className="text-lg font-medium mb-4">Danger zone</h2>
                                    <p className="text-sm text-destructive-foreground">You can delete your store by clicking the button below.</p>
                                    <p className="text-sm text-destructive-foreground mb-4">Keep in mind that this action is irreversible and it will delete all the data associated with your store.</p>
                                    <DeleteStoreButton storeId={store.id} />
                                </section>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="products">
                        <Card>
                            <CardHeader>
                                <CardTitle>Products</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4 items-start">

                                <div className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-4 w-full">
                                    <Card className="border-dashed">
                                        <CardHeader>
                                            <CardTitle>New Product</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex justify-center items-center grow">
                                            <CreateProductButton storeId={store.id} />
                                        </CardContent>
                                    </Card>
                                    {store.products.map((product) => (
                                        <Card key={product.id}>
                                            <CardHeader>
                                                <CardTitle>{product.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p>{product.description}</p>
                                            </CardContent>
                                            <CardFooter className="flex justify-between">
                                                <p>{product.stock} {product.stock > 1 ? "items" : "item"} left</p>
                                                <p>${product.price}</p>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
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
                                {store.branches.map((branch) => (
                                    <article key={branch.id} className="border border-border p-4 rounded-md">
                                        <p className="flex items-center gap-2">
                                            <House />
                                            {branch.name}
                                        </p>
                                    </article>
                                ))}
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