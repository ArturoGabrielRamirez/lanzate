/* import { Category } from "@prisma/client" */
import { ShoppingBag } from "lucide-react"
import Link from "next/link"

/* import { Title } from "@/features/layout/components" */
import { PageContainer } from "@/features/layout/components"
import { getPublicStoreProductDetailsAction } from "@/features/products/actions/get-public-store-product-details.action"
import { Comments, RelatedProducts/* , VariantDetailClient */ } from "@/features/products/components"
import { AddToCartButton } from "@/features/products/components/add-to-cart-button"
import { Button } from "@/features/shadcn/components/ui/button"

/* import type { Product, ProductVariant, Color } from "@prisma/client" */

type Props = {
    params: Promise<{ id: string; subdomain: string; variant?: string }>
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

async function ProductDetailsPage({ params, searchParams }: Props) {

    const { id, subdomain } = await params
    await searchParams

    const { payload: product, hasError, message } = await getPublicStoreProductDetailsAction(id, subdomain)

    if (hasError || !product) {
        return (
            <PageContainer className="![padding-top:calc(var(--section-padding-top)_+_2rem)]">
             {/*    <Title
                    title="Product Not Found"
                    breadcrumbs={[{ label: "Product Not Found", href: `/item/${id}` }]}
                    homePath={`/`}
                /> */}
                <p className="text-red-500 mt-4">{message}</p>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
           {/*  <Title
                title={product.name}
                breadcrumbs={[
                    ...product.categories.map((category: Category) => ({
                        label: category.name,
                        href: `/category/${category.id}`
                    })),
                    { label: product.name, href: `/item/${id}` }
                ]}
                homePath={`/`}
            /> */}

            <div className="grow flex flex-col">
                <div className="space-y-6 text-primary overflow-y-auto max-h-[calc(100vh-205px)] pr-0 lg:pr-4 relative">
                {/*     <VariantDetailClient product={product as unknown as Product & { variants?: (ProductVariant & { color: Color | null })[] }} /> */}

                    <div className="flex flex-col gap-4 border-b border-muted-foreground/30 pb-6">
                        {product.description && (
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">Descripción</h3>
                                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {product.sku && (
                            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                        )}
                        <div className="flex gap-2 justify-end">
                            <AddToCartButton product={product} withText className="text-lg p-6 !px-8 !bg-accent text-accent-foreground" canBeAddedToCart={true} />
                            <Button variant="outline" size="lg" className="text-lg p-6 !px-8" asChild>
                                <Link href="/checkout">
                                    <ShoppingBag />
                                    <span>Finalizar compra</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Comments productId={product.id} />

                </div>
            </div>
            <div className="container mx-auto mt-10">
                <RelatedProducts productId={product.id} />
            </div>
        </PageContainer>
    )
}
export default ProductDetailsPage