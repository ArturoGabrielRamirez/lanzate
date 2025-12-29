import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { getProductDetailsAction } from "@/features/products/actions/get-product-details.action"
/* import { CreateProductButton } from "@/features/products/components" */
/* import { VariantDetailForm } from "@/features/products/components/variant-detail-display" */
import { Card, CardHeader, CardTitle/* , CardContent  */} from "@/features/shadcn/components/ui/card"

type Props = { params: Promise<{ slug: string; id: string; variant: string }> }

export default async function ProductVariantDetailPage({ params }: Props) {
    const { slug, id/* , variant */ } = await params

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()
    if (userError || !user) {
        console.error(userMessage)
        return null
    }

    const { payload: product, hasError, message: errorMessage } = await getProductDetailsAction(id)
    if (hasError || !product) {
        console.error(errorMessage)
        return null
    }

  /*   const variantId = Number(variant) */
 /*    const variantData = product.variants?.find((v: { id: number }) => v.id === variantId) */

  /*   if (!variantData) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">Variante no encontrada</p>
                </CardContent>
            </Card>
        )
    } */

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Link
                                href={`/stores/${slug}/products/${id}`}
                                className="hover:opacity-70 transition-opacity"
                            >
                                <ArrowLeft className="size-4" />
                            </Link>
                            Detalle de Variante
                        </CardTitle>

                        {/* <CreateProductButton
                            storeId={product.store_id}
                            userId={user.id}
                            onlyIcon={true}
                        /> */}
                    </div>
                </CardHeader>
            </Card>

           {/*  <VariantDetailForm
                variant={variantData}
                productPrice={product.price}
                slug={slug}
                productId={Number(id)}
                product={product}
            /> */}
        </div>
    )
}