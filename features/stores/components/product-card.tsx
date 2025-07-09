"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Product } from "@/prisma/generated/prisma"
import { Box } from "lucide-react"
import { useQueryState } from "nuqs"

type Props = {
    product: Product
}

function ProductCard({ product }: Props) {

    const [_, setProduct] = useQueryState('product_id')

    const handleClick = () => {
        setProduct(product.id.toString())
    }

    return (
        <Card key={product.id} onClick={handleClick}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Box className="size-4" />
                    <h3 className="font-bold text-sm">{product.name}</h3>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>{product.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <p>{product.stock} {product.stock > 1 ? "items" : "item"} left</p>
                <p>${product.price}</p>
            </CardFooter>
        </Card>
    )
}

export default ProductCard