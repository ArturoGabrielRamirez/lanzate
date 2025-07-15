"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/features/cart/components/cart-provider"
import { Product } from "@/prisma/generated/prisma"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Props = {
    product: Product
}

function ProductCard({ product }: Props) {

    const router = useRouter()
    const { addToCart } = useCart()

    const handleClick = () => {
        router.push(`/item/${product.id}`)
    }

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        toast.loading("Adding to cart...")
        addToCart({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            quantity: 1
        })
        setTimeout(() => {
            toast.success("Added to cart!")
        }, 1000)
    }


    return (
        <Card key={product.id} className="aspect-9/12 bg-accent hover:scale-105 transition-all cursor-pointer" onClick={handleClick}>
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">{product.description || "No description available for this product"}</CardDescription>
            </CardHeader>
            <CardContent className="grow">
                <img src="https://api.dicebear.com/9.x/icons/svg?seed=boxes" alt="Product Image" className="rounded-md" />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <p>${product.price}</p>
                <Button variant="outline" size="icon" onClick={handleAddToCart}>
                    <ShoppingCart />
                </Button>
            </CardFooter>
        </Card>
    )
}
export default ProductCard