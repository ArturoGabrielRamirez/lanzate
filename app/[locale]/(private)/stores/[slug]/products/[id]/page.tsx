import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { getProductDetailsAction } from "@/features/products/actions/get-product-details.action"
/* import { CreateProductButton, DeleteProductButton } from "@/features/products/components" */
/* import { ProductDetailForm } from "@/features/products/components/product-detail-display" */
import { ProductDetailPageProps } from "@/features/products/types"
import { Card, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"

async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { slug, id } = await params

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        console.error(userMessage)
        return null
    }

    const { payload: product, hasError: error, message: errorMessage } = await getProductDetailsAction(id)

    if (error || !product) {
        console.error(errorMessage)
        return null
    }

    const t = await getTranslations("store.products")

    return (
        <div className="space-y-6">
            {/* Header con navegación y botones de acción */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Link 
                                href={`/stores/${slug}/products`}
                                className="hover:opacity-70 transition-opacity"
                            >
                                <ArrowLeft className="size-4" />
                            </Link>
                            {t("product-details")}
                        </CardTitle>
                        
                        {/* ✅ Botones de acción */}
                        <div className="flex items-center gap-2">
                        {/*     <CreateProductButton 
                                storeId={product.store_id}
                                userId={user.id}
                                onlyIcon={true}
                            />
                            <DeleteProductButton
                                productId={product.id}
                                slug={slug}
                                userId={user.id}
                            /> */}
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Contenido principal con las cards */}
           {/*  <ProductDetailForm
                product={product}
                slug={slug}
                userId={user.id}
            /> */}
        </div>
    )
}

export default ProductDetailPage