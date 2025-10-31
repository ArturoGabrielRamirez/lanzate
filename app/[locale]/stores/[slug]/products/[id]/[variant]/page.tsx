import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { getProductDetailsAction } from "@/features/products/actions/get-product-details.action"
import { VariantDetailForm } from "@/features/products/components/variant-detail-display"
import { Card, CardContent } from "@/features/shadcn/components/ui/card"
/* import { getTranslations } from "next-intl/server" */

type Props = { params: Promise<{ slug: string; id: string; variant: string }> }

export default async function ProductVariantDetailPage({ params }: Props) {
    const { slug, id, variant } = await params

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()
    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: product, hasError } = await getProductDetailsAction(id)
    if (hasError || !product) return null

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

 /*    const t = await getTranslations("store.products") */
    
    // Filtrar otras variantes (excluyendo la actual)
   /*  const otherVariants = (product.variants ?? []).filter((v: { id: number }) => v.id !== variantId) */

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
        </div>
    )
}


