"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@/prisma/generated/prisma"
import { Box } from "lucide-react"
import { useRouter } from "next/navigation"

type Props = {
    product: Product
    slug: string
}

function ProductCard({ product, slug }: Props) {


    const router = useRouter()

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
                <p className="text-muted-foreground text-sm line-clamp-2">{product.description || "No description available"}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <p className="text-muted-foreground text-sm">{product.stock} {product.stock > 1 ? "items" : "item"} left</p>
                <p className="font-bold">${product.price}</p>
            </CardFooter>
        </Card>
    )
}

export default ProductCard