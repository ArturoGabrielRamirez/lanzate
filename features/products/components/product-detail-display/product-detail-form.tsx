"use client"

import { Product, Category, ProductVariant } from "@prisma/client"
import { BasicInfoDisplay, MediaDisplay, PriceStockDisplay, CategoriesDisplay, VariantsDisplay, SettingsDisplay, DimensionsDisplay } from "./index"

interface ProductDetailFormProps {
    product: Product & {
        categories: Category[]
        variants: (ProductVariant & {
            color?: { name: string } | null
            stocks?: { quantity: number }[]
            primary_media?: { url: string } | null
        })[]
        media?: { id: number; url: string; type: string }[]
        primary_media?: { id: number; url: string; type: string } | null
    }
    slug: string
    userId: number
}

const ProductDetailForm = ({ product, slug, userId }: ProductDetailFormProps) => {
    return (
        <div className="space-y-6">
            {/* Primera fila: Información básica y Medios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BasicInfoDisplay
                    product={product}
                    slug={slug}
                    userId={userId}
                />
                <MediaDisplay
                    product={product}
                />
            </div>

            {/* Segunda fila: Precio/Stock y Categorías */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PriceStockDisplay
                    product={product}
                    slug={slug}
                    userId={userId}
                />
                <CategoriesDisplay
                    product={product}
                />
            </div>

            {/* Tercera fila: Variantes (ancho completo) */}
            <VariantsDisplay
                product={product}
                slug={slug}
                userId={userId}
            />

            {/* Cuarta fila: Configuraciones y Dimensiones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SettingsDisplay
                    product={product}
                />
                <DimensionsDisplay
                    product={product}
                />
            </div>
        </div>
    )
}

export default ProductDetailForm
