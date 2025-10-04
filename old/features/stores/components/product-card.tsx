"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Box } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProductCardProps } from "@/features/products/type"
import { useTranslations } from "next-intl"

function ProductCard({ product, slug }: ProductCardProps) {

    const router = useRouter()
    const t = useTranslations("store.product-card")

    const handleClick = () => {
        router.push(`/stores/${slug}/products/${product.id}`)
    }

    return (
        <Card key={product.id} onClick={handleClick} className="cursor-pointer hover:bg-primary hover:scale-105 transition-all duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Box className="size-4" />
                    <h3 className="font-bold text-base line-clamp-1">{product.name}</h3>
                </CardTitle>
            </CardHeader>
            <CardContent className="grow">
                <p className="text-muted-foreground text-sm line-clamp-2">{product.description || t("no-description")}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <p className="text-muted-foreground text-sm">
                    {product.stock} {product.stock > 1 ? t("items-left") : t("item-left")}
                </p>
                <p className="font-bold">${product.price}</p>
            </CardFooter>
        </Card>
    )
}

export default ProductCard