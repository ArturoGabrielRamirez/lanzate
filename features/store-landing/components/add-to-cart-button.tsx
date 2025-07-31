"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/features/cart/components/cart-provider"
import { Product } from "@prisma/client"
import { ShoppingCart } from "lucide-react"

type Props = {
    product: Product
}

function AddToCartButton({ product }: Props) {
    const { addToCart } = useCart()

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        addToCart({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image || ""
        })
    }

    return (
        <Button variant="outline" size="icon" onClick={handleAddToCart} className="border-none">
            <ShoppingCart />
        </Button>
    )
}

export default AddToCartButton 