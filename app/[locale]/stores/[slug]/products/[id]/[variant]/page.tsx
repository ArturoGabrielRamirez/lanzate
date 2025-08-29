import { getProductDetails } from "@/features/stores/actions/getProductDetails"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Boxes } from "lucide-react"
import DeleteVariantButton from "@/features/products/components/delete-variant-button"
import { VariantDetailForm } from "@/features/products/components/variant-detail-display"
import Link from "next/link"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getTranslations } from "next-intl/server"

type Props = { params: Promise<{ slug: string; id: string; variant: string }> }

export default async function ProductVariantDetailPage({ params }: Props) {
    const { slug, id, variant } = await params

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()
    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: product, error } = await getProductDetails(id)
    if (error || !product) return null

    const variantId = Number(variant)
    const variantData = (product.variants ?? []).find((v: { id: number }) => v.id === variantId)

    if (!variantData) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">Variante no encontrada</p>
                </CardContent>
            </Card>
        )
    }

    const t = await getTranslations("store.products")
    
    // Filtrar otras variantes (excluyendo la actual)
    const otherVariants = (product.variants ?? []).filter((v: { id: number }) => v.id !== variantId)

    return (
        <div className="space-y-6">
            {/* Header */}
            {/* <Card>
                <CardHeader>
                    <CardTitle>
                        {t("product-details")}
                    </CardTitle>
                </CardHeader>
            </Card> */}

            {/* Contenido principal con las cards */}
            <VariantDetailForm
                variant={variantData}
                productPrice={product.price}
                slug={slug}
                productId={Number(id)}
                product={product}
            />

            {/* Otras variantes del producto */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2 text-lg">
                            <Boxes className="size-5" />
                            Otras variantes del producto
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                {otherVariants.length === 0 
                                    ? "No hay otras variantes" 
                                    : `${otherVariants.length} variante${otherVariants.length > 1 ? 's' : ''} adicional${otherVariants.length > 1 ? 'es' : ''}`
                                }
                            </label>
                            {otherVariants.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Esta es la única variante de este producto</p>
                            ) : (
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {otherVariants.map((variant: any) => {
                                        const total = (variant.stocks ?? []).reduce((s: number, x: { quantity: number }) => s + (x.quantity ?? 0), 0)
                                        const label = [variant.size_or_measure, variant.color?.name].filter(Boolean).join(" · ") || `Variante ${variant.id}`
                                        
                                        return (
                                            <Link 
                                                key={variant.id} 
                                                href={`/stores/${slug}/products/${id}/${variant.id}`}
                                                className="rounded-md border p-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors"
                                            >
                                                {variant.primary_media?.url ? (
                                                    <img 
                                                        src={variant.primary_media.url} 
                                                        alt={label} 
                                                        className="h-12 w-12 rounded object-cover" 
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded bg-secondary flex items-center justify-center">
                                                        <Boxes className="size-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div className="flex flex-col flex-1">
                                                    <span className="text-sm font-medium">{label}</span>
                                                    <span className="text-xs text-muted-foreground">Stock: {total} unidades</span>
                                                    {variant.price && variant.price !== product.price && (
                                                        <span className="text-xs text-muted-foreground">Precio: ${variant.price}</span>
                                                    )}
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


