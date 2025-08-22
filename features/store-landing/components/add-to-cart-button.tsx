"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useCart } from "@/features/cart/components/cart-provider"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Product } from "@prisma/client"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"

type Props = {
    product: Product
    withText?: boolean
    className?: string
}

function AddToCartButton({ product }: Props) {
    const { addToCart } = useCart()
    const [isAdded, setIsAdded] = useState(false)

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        addToCart({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image || ""
        })
        setIsAdded(true)
        setTimeout(() => {
            setIsAdded(false)
        }, 300)
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <IconButton
                    animate
                    active={isAdded}
                    icon={ShoppingCart}
                    size="md"
                    onClick={handleAddToCart}
                    iconClassName="text-foreground"
                />
            </TooltipTrigger>
            <TooltipContent>
                <p>Add to Cart</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default AddToCartButton 