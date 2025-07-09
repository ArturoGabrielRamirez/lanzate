"use client"

import { useQueryState } from "nuqs"
import ProductCard from "./product-card"
import { Product } from "@/prisma/generated/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import CreateProductButton from "@/features/products/components/create-product-button"
import ProductDetail from "./product-detail"
import { Suspense } from "react"

type Props = {
    products: Product[]
    storeId: number
}

function ProductListDetail({ products, storeId }: Props) {

    const [productId] = useQueryState('product_id')

    return (
        <>
            {!productId && (
                <div className="grid grid-cols-1 lg:grid-cols-[repeat(auto-fill,minmax(min(200px,100%),1fr))] gap-4 w-full">
                    <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="size-4" />
                                <h3 className="font-bold text-sm">New Product</h3>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center grow">
                            <CreateProductButton storeId={storeId} />
                        </CardContent>
                    </Card>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
            {productId && (
                    <ProductDetail productId={productId} />
            )}
        </>
    )
}

export default ProductListDetail
