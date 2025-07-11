"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useCart } from "./cart-provider"

type Props = {}

function CartIcon({ }: Props) {

    const { quantity } = useCart()

    return (
        <Button variant="outline" asChild size="icon">
            <Link href="/cart" className="relative">
                <ShoppingCart />
                {quantity > 0 && (
                    <Badge className="absolute -bottom-2 right-1/2">
                        {quantity}
                    </Badge>
                )}
            </Link>
        </Button>
    )
}
export default CartIcon