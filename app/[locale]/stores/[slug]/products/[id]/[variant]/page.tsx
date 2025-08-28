import { getProductDetails } from "@/features/stores/actions/getProductDetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import DeleteVariantButton from "@/features/products/components/delete-variant-button"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { Badge } from "@/components/ui/badge"
import { Category } from "@prisma/client"
import { DeleteProductButton, EditProductButton } from "@/features/products/components"

type Props = { params: Promise<{ slug: string; id: string; variant: string }> }

export default async function ProductVariantDetailPage({ params }: Props) {
    const { slug, id, variant } = await params
    const t = await getTranslations("store.products")
    const { payload: product, error } = await getProductDetails(id)
    if (error || !product) return null
    const variantId = Number(variant)
    const list = (product.variants ?? []).filter((v: { id: number }) => v.id === variantId)
    const primaryUrl = product.primary_media?.url || product.media?.[0]?.url || "https://api.dicebear.com/9.x/icons/svg?seed=boxes"
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link href={`/stores/${slug}/products`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                    {t("product-details")}
                </CardTitle>
            </CardHeader>
            <CardContent className="grow flex">
                <div className="grid grid-cols-1 lg:grid-cols-[max-content_1fr] grid-rows-[auto_1fr] lg:grid-rows-1 gap-4 w-full">
                    <div className="w-full h-35 lg:h-full lg:w-60 xl:w-80 overflow-hidden rounded-md group bg-secondary relative">
                        <img src={primaryUrl} alt={`${product.name} image`} className="object-cover h-full w-full bg-center group-hover:scale-105 transition-all duration-300 scale-y-95 scale-x-93 rounded-md" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-4xl font-bold">{product.name}</h3>
                        <div className="flex gap-2 flex-wrap">
                            {product.categories.length === 0 && (
                                <Badge variant="outline">{t("no-categories")}</Badge>
                            )}
                            {product.categories.map((category: Category) => (
                                <Badge key={category.id} variant="outline">{category.name}</Badge>
                            ))}
                        </div>
                        <p className="text-muted-foreground text-lg">${product.price}</p>
                        {product.media && product.media.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto py-1">
                                {product.media.map((m: { id: number; url: string }, idx: number) => (
                                    <img key={m.id ?? idx} src={m.url} alt={`image-${idx}`} className="h-16 w-16 rounded object-cover border" />
                                ))}
                            </div>
                        )}
                        {list.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-semibold">Variantes</h4>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {list.map((v: { id: number; size_or_measure: string | null; color?: { name: string } | null; stocks?: { quantity: number }[]; primary_media?: { url: string } | null }) => {
                                        const total = (v.stocks ?? []).reduce((s: number, x: { quantity: number }) => s + (x.quantity ?? 0), 0)
                                        const label = [v.size_or_measure, v.color?.name].filter(Boolean).join(" · ") || `Variante ${v.id}`
                                        return (
                                            <div key={v.id} className="rounded-md border p-2 flex items-center gap-3">
                                                {v.primary_media?.url ? (
                                                    <img src={v.primary_media.url} alt={label} className="h-10 w-10 rounded object-cover" />
                                                ) : null}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{label}</span>
                                                    <span className="text-xs text-muted-foreground">Stock: {total}</span>
                                                </div>
                                                <div className="ml-auto">
                                                    <DeleteVariantButton variantId={v.id} slug={slug} productId={Number(id)} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                        <p>{product.description || "No description available"}</p>
                        <div className="flex justify-center md:justify-end mt-auto">
                            <div className="grid grid-cols-2 gap-4 mt-auto justify-end max-w-xs">
                                <DeleteProductButton productId={Number(id)} slug={slug} userId={0} />
                                <EditProductButton product={product} slug={slug} userId={0} />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


