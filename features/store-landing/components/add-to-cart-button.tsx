"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/features/cart/components/cart-provider"
import { cn } from "@/lib/utils"
import { Product } from "@prisma/client"
import { ShoppingCart } from "lucide-react"

type Props = {
    product: Product
    withText?: boolean
    className?: string
}

function AddToCartButton({ product, withText = false, className }: Props) {
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
        <Button variant="outline" size={withText ? "default" : "icon"} onClick={handleAddToCart} className={cn("border-none", className)}>
            <ShoppingCart />
            {withText && <span>Add to Cart</span>}
        </Button>
    )
}

export default AddToCartButton 