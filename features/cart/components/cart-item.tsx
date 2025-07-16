"use client"

import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { CartItemType } from "../types"

type CartItemProps = {
    item: CartItemType
}

function CartItem({ item }: CartItemProps) {

    const { removeFromCart } = useCart()

    const handleRemove = () => {
        removeFromCart(item.id)
    }

    return (
        <div className="grid grid-cols-[max-content_1fr] gap-2 border-b border-b-muted-foreground/20 pb-2">
            <img src="https://api.dicebear.com/9.x/icons/svg?seed=boxes" alt="Product Image" className="object-cover h-full w-full bg-center group-hover:scale-105 transition-all duration-300 scale-y-95 scale-x-93 rounded-md max-w-20" />
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        ${item.price} x {item.quantity} {item.quantity > 1 ? "items" : "item"}
                    </p>
                </div>
                <Button variant="destructive" size="icon" onClick={handleRemove} className="self-end">
                    <Trash2 />
                </Button>
            </div>
        </div>
    )
}

export default CartItem