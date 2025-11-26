/* import { Category } from "@prisma/client" */
import { Image as ImageIcon, Share, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

/* import { Title } from "@/features/layout/components" */
import { PageContainer } from "@/features/layout/components/page-container"
import { getPublicStoreProductDetailsAction } from "@/features/products/actions/get-public-store-product-details.action"
import { AddToCartButton, LikeButton, VariantDetailClient } from "@/features/products/components"
import { Button } from "@/features/shadcn/components/ui/button"

import type { Product, ProductVariant, Color } from "@prisma/client"

type Props = {
    params: Promise<{ id: string; subdomain: string; variant: string }>
}

export default async function ProductVariantDetailsPage({ params }: Props) {
    const { id, subdomain, variant } = await params

    const { payload: product, hasError, message } = await getPublicStoreProductDetailsAction(id, subdomain, variant)

    if (hasError || !product) {
        return (
            <PageContainer className="![padding-top:calc(var(--section-padding-top)_+_2rem)]">
                {/* <Title
                    title="Product Not Found"
                    breadcrumbs={[{ label: "Product Not Found", href: `/item/${id}/${variant}` }]}
                    homePath={`/`}
                /> */}
                <p className="text-red-500 mt-4">{message}</p>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
      {/*       <Title
                title={product.name}
                breadcrumbs={[
                    ...product.categories.map((category: Category) => ({
                        label: category.name,
                        href: `/category/${category.id}`
                    })),
                    { label: product.name, href: `/item/${id}/${variant}` }
                ]}
                homePath={`/`}
            /> */}

            <div className="grow flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(min(400px,100%),1fr)_1fr] gap-12 grow">
                    <div className="flex gap-8 border-r pr-12 border-muted-foreground">
                        <div className="flex flex-col gap-4 max-w-28 w-full">
                            <div className="flex flex-col gap-4 bg-gray-100 rounded-lg p-2">
                                <div className="text-gray-400 flex flex-col items-center justify-center gap-2 aspect-square">
                                    <ImageIcon className="size-10" />
                                    <p className="text-sm text-muted-foreground text-center">No hay imagen disponible</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 relative rounded-lg flex items-center justify-center grow">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-lg"
                                    fill
                                />
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center justify-center gap-2">
                                    <ImageIcon className="size-16" />
                                    <p className="text-sm text-muted-foreground">No hay imagen disponible</p>
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

                    <div className="space-y-4 text-primary overflow-y-auto max-h-[calc(100vh-205px)] pr-4 relative">
                        <VariantDetailClient
                            product={product as unknown as Product & { variants?: (ProductVariant & { color: Color | null })[] }}
                            initialVariantId={parseInt(variant)}
                        />

                        <div className="flex flex-col gap-2 border-b border-muted-foreground pb-4">
                            {product.description && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                                    <p className="text-gray-700">{product.description}</p>
                                </div>
                            )}

                            {product.sku && (
                                <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
                            )}
                            <div className="flex gap-2 justify-end">
                                <AddToCartButton
                                    product={product}
                                    withText
                                    className="text-lg p-6 !px-8 !bg-accent text-accent-foreground"
                                    canBeAddedToCart={true}
                                    overrideId={parseInt(variant)}
                                    overrideName={product.variants?.find(v => v.id === parseInt(variant))?.name ?? product.name}
                                    overridePrice={product.variants?.find(v => v.id === parseInt(variant))?.price ?? product.price}
                                    overrideImage={product.image ?? undefined}
                                />
                                <Button variant="outline" size="lg" className="text-lg p-6 !px-8" asChild>
                                    <Link href="/checkout">
                                        <ShoppingBag />
                                        <span>Checkout</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}


