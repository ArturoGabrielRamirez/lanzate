import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { Title } from "@/features/layout/components"
import { CreateStoreButton } from "@/features/stores/components"
import { ArrowRight, ChevronRight, Hand, Settings, Share, Share2, ShoppingCart, Store } from "lucide-react"


async function DashboardPage() {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }
    
    return (
        <section className="p-4 flex flex-col max-md:pt-24">
            <Title title={(
                <div className="flex items-center gap-2">
                    <Hand />
                    Welcome!
                </div>
            )} />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(350px,100%),1fr))] gap-4">
                <Card>
                    <CardHeader>
                        <div className="grid grid-cols-[100px_1fr] gap-4">
                            <div className="bg-primary/10 rounded-md flex items-center justify-center aspect-square">
                                <Store className="size-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ArrowRight className="size-4" />
                                    <h2 className="font-normal text-sm">Step 1</h2>
                                </CardTitle>
                                <CardDescription className="font-bold text-2xl text-accent-foreground">
                                    Create a new store
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground/50">
                        To get started selling like a pro, you need to create a new store. This will give you your storefront, a place to list your products, and a place to manage your orders.
                    </CardContent>
                    <CardFooter>
                        <CreateStoreButton userId={user.id} />
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="grid grid-cols-[100px_1fr] gap-4">
                            <div className="bg-primary/10 rounded-md flex items-center justify-center aspect-square">
                                <ShoppingCart className="size-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ArrowRight className="size-4" />
                                    <h2 className="font-normal text-sm">Step 2</h2>
                                </CardTitle>
                                <CardDescription className="font-bold text-2xl text-accent-foreground">
                                    Create a product
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground/50">
                        Once created, your products will be visible to customers and ready for sale. You can add images, descriptions, pricing, and inventory tracking.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="grid grid-cols-[100px_1fr] gap-4">
                            <div className="bg-primary/10 rounded-md flex items-center justify-center aspect-square">
                                <Settings className="size-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ArrowRight className="size-4" />
                                    <h2 className="font-normal text-sm">Step 3</h2>
                                </CardTitle>
                                <CardDescription className="font-bold text-2xl text-accent-foreground">
                                    Set up your account
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground/50">
                        To finish setting up your account, choose whether your store offers delivery, set your delivery fee, and your payment options.
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="grid grid-cols-[100px_1fr] gap-4">
                            <div className="bg-primary/10 rounded-md flex items-center justify-center aspect-square">
                                <Share2 className="size-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <ArrowRight className="size-4" />
                                    <h2 className="font-normal text-sm">Step 4</h2>
                                </CardTitle>
                                <CardDescription className="font-bold text-2xl text-accent-foreground">
                                    Share your store's link!
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground/50">
                        Share your store's link with your customers to start selling!
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default DashboardPage