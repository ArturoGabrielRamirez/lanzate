import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, Title } from "@/features/layout/components"
import AddToCartButton from "@/features/store-landing/components/add-to-cart-button"
import { getProductDetails } from "@/features/subdomain/actions/getProductDetails"
import { Category } from "@prisma/client"
import { Flame, Share, ShoppingBag, ShoppingCart } from "lucide-react"
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
                breadcrumbs={[{ label: product.name, href: `/item/${id}` }]}
                homePath={`/`}
            />

            <div className="grow flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(min(400px,100%),1fr)_1fr] gap-12 grow">
                    <div className="flex gap-8 border-r pr-8 border-muted-foreground">
                        {/* Product Image */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 bg-gray-100 rounded-lg p-4">
                                <div className="text-gray-400 flex flex-col items-center justify-center gap-2">
                                    <svg className="size-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-muted-foreground">No image available</p>
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
                                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-muted-foreground">No image available</p>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Button variant="outline" size="icon">
                                <Share />
                            </Button>
                            <Button variant="outline" size="icon">
                                <Flame />
                            </Button>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4 text-primary">
                        <div className="flex flex-col gap-2">
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

                        <div className="">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Comentarios</h3>
                            <p className="text-sm text-muted-foreground mb-2">No hay comentarios aún. Podés ser el primero en comentar!</p>
                            <Form
                                className="w-full flex flex-col gap-2 items-end"
                                contentButton={<span>Comentar</span>}
                                formAction={async (formData) => {
                                    "use server"
                                    console.log(formData)
                                }}
                            >
                                <Textarea placeholder="Escribe un comentario" />
                            </Form>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
export default ProductDetailsPage