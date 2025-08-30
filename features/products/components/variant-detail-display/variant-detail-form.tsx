"use client"

import { ProductVariant } from "@prisma/client"
import { VariantBasicInfoDisplay, VariantMediaDisplay, VariantStockDisplay, VariantPriceDisplay } from "./index"

interface VariantDetailFormProps {
    variant: ProductVariant & {
        color?: { name: string } | null
        stocks?: { quantity: number; branch_id: number }[]
        primary_media?: { id: number; url: string; type: string } | null
        media?: { id: number; url: string; type: string }[]
    }
    productPrice: number
    slug: string
    productId: number
    product: any
}

const VariantDetailForm = ({ variant, productPrice, slug, productId, product }: VariantDetailFormProps) => {
    return (
        <div className="space-y-6">
            {/* Primera fila: Información básica y Medios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VariantBasicInfoDisplay
                    variant={variant}
                    slug={slug}
                    productId={productId}
                    product={product}
                />
                <VariantMediaDisplay
                    variant={variant}
                    product={product}
                />
            </div>

            {/* Segunda fila: Stock y Precio */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VariantStockDisplay
                    variant={variant}
                />
                <VariantPriceDisplay
                    variant={variant}
                    productPrice={productPrice}
                />
            </div>
        </div>
    )
}

export default VariantDetailForm
