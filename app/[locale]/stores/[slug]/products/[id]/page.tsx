import { getProductDetails } from "@/features/products/actions/getProductDetails"

import { DeleteProductButton } from "@/features/products/components"
import { Card, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { ProductDetailForm } from "@/features/products/components/product-detail-display"

import { ProductDetailPageProps } from "@/features/products/type"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getTranslations } from "next-intl/server"

async function ProductDetailPage({ params }: ProductDetailPageProps) {

    const { slug, id } = await params

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: product, error } = await getProductDetails(id)
    console.log("🚀 ~ ProductDetailPage ~ product:", product)

    if (error || !product) {
        return console.log(error)
    }

    const t = await getTranslations("store.products")

    return (
        <div className="space-y-6">
            {/* Header con navegación y botones de acción */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Link href={`/stores/${slug}/products`}>
                                <ArrowLeft className="size-4" />
                            </Link>
                            {t("product-details")}
                        </CardTitle>
                        <div className="flex gap-2">
                            <DeleteProductButton
                                productId={product.id}
                                slug={slug}
                                userId={user.id}
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Contenido principal con las cards */}
            <ProductDetailForm
                product={product}
                slug={slug}
                userId={user.id}
            />
        </div>
    )
}

export default ProductDetailPage