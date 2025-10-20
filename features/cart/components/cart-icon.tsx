"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/features/cart/components"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { useEffect, useState } from "react"
import { Badge } from "@/features/shadcn/components/ui/badge"
import Link from "next/link"

function CartIcon() {

    const { quantity } = useCart()
    const [active, setActive] = useState(false)

    useEffect(() => {

        setActive(true)

        setTimeout(() => {
            setActive(false)
        }, 500)

    }, [quantity])


    return (
        <Link href="/cart" className="relative h-[40px]">
            <IconButton
                icon={ShoppingCart}
                active={active}
                className="relative"
                size="md"
                iconClassName="size-5"
            />
            <Badge className="absolute right-0 rounded-full font-mono text-xs aspect-square p-1">
                {quantity}
            </Badge>
        </Link>
    )
}
export default CartIcon