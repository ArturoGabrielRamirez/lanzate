"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { useCart } from "@/features/cart/components/cart-provider"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Product } from "@prisma/client"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"

type Props = {
    product: Product
    withText?: boolean
    className?: string
    canBeAddedToCart: boolean
    overrideId?: string | number
    overrideName?: string
    overridePrice?: number
    overrideImage?: string
}

function AddToCartButton({ product, canBeAddedToCart, overrideId, overrideName, overridePrice, overrideImage }: Props) {
    const { addToCart } = useCart()
    const [isAdded, setIsAdded] = useState(false)

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        const id = (overrideId ?? product.id).toString()
        const name = overrideName ?? product.name
        const price = overridePrice ?? product.price
        const image = overrideImage ?? product.image ?? ""
        addToCart({ id, name, price, quantity: 1, image })
        setIsAdded(true)
        setTimeout(() => {
            setIsAdded(false)
        }, 300)
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <IconButton
                    disabled={!canBeAddedToCart}
                    animate
                    active={isAdded}
                    icon={ShoppingCart}
                    size="md"
                    onClick={handleAddToCart}
                    iconClassName={!canBeAddedToCart ? "text-muted-foreground/50" : "text-foreground"}
                />
            </TooltipTrigger>
            <TooltipContent>
                <p>{canBeAddedToCart ? "Add to Cart" : "Product not available"}</p>
            </TooltipContent>
        </Tooltip>
    )
}

export default AddToCartButton 