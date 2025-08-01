import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Title } from "@/features/layout/components"
import AddToCartButton from "@/features/store-landing/components/add-to-cart-button"
import LikeButton from "@/features/store-landing/components/like-button"
import { getProductDetails } from "@/features/subdomain/actions/getProductDetails"
import Comments from "@/features/subdomain/components/comments"
import { Category } from "@prisma/client"
import { Flame, Image, Share, ShoppingBag } from "lucide-react"
import Link from "next/link"

type Props = {
    params: Promise<{ id: string; subdomain: string }>
}

async function ProductDetailsPage({ params }: Props) {

    const { id, subdomain } = await params

    const { payload: product, error, message } = await getProductDetails(id, subdomain)

    if (error || !product) {
        return (
            <section className="p-4">
                <Title
                    title="Product Not Found"
                    breadcrumbs={[{ label: "Product Not Found", href: `/item/${id}` }]}
                    homePath={`/`}
                />
                <p className="text-red-500 mt-4">{message}</p>
            </section>
        )
    }

    return (
        <section className="p-4 grow flex flex-col pb-8">
            <Title
                title={product.name}
                breadcrumbs={[
                    ...product.categories.map((category: Category) => ({
                        label: category.name,
                        href: `/category/${category.id}`
                    })),
                    { label: product.name, href: `/item/${id}` }
                ]}
                homePath={`/`}
            />

            <div className="grow flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(min(400px,100%),1fr)_1fr] gap-12 grow">
                    <div className="flex gap-8 border-r pr-12 border-muted-foreground">
                        {/* Product Image */}
                        <div className="flex flex-col gap-4 max-w-28 w-full">
                            <div className="flex flex-col gap-4 bg-gray-100 rounded-lg p-2">
                                <div className="text-gray-400 flex flex-col items-center justify-center gap-2 aspect-square">
                                    <Image className="size-10" />
                                    <p className="text-sm text-muted-foreground text-center">No image</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-lg flex items-center justify-center grow">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center justify-center gap-2">
                                    <Image className="size-16" />
                                    <p className="text-sm text-muted-foreground">No image available</p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Button variant="outline" size="icon">
                                <Share />
                            </Button>
                            <LikeButton productId={product.id} />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4 text-primary overflow-y-auto max-h-[calc(100vh-205px)] pr-4 relative">
                        <div className="flex flex-col gap-2 sticky top-0 left-0 w-full bg-background">
                            <p className="text-sm text-muted-foreground">Sin marca</p>
                            <h2 className="text-4xl font-bold leading-[0.8]">{product.name}</h2>
                            {product.categories && product.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {product.categories.map((category: Category) => (
                                        <Badge key={category.id} variant="secondary" className="bg-accent text-accent-foreground">
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                        </div>


                        <div className="text-3xl font-bold border-b border-muted-foreground pb-4">
                            ${product.price}
                        </div>

                        <div className="flex flex-col gap-2 border-b border-muted-foreground pb-4">
                            {product.description && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-700">{product.description}</p>
                                </div>
                            )}

                            {product.sku && (
                                <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
                            )}
                            <div className="flex gap-2 justify-end">
                                <AddToCartButton product={product} withText className="text-lg p-6 !px-8 !bg-accent text-accent-foreground" />
                                <Button variant="outline" size="lg" className="text-lg p-6 !px-8" asChild>
                                    <Link href="/checkout">
                                        <ShoppingBag />
                                        <span>Checkout</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <Comments productId={product.id} />

                    </div>
                </div>
            </div>
        </section>
    )
}
export default ProductDetailsPage