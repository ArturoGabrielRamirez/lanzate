"use client"

import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingBag } from "lucide-react"
import CartItem from "./cart-item"

function CartList() {

    const { cart, clearCart } = useCart()

    return (
        <div className="flex-1">
            {cart.map((item) => (
                <CartItem key={item.id} item={item} />
            ))}
            <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline" onClick={clearCart}   >
                    <Trash2 />
                    <span>Remove all</span>
                </Button>
                <Button variant="outline">
                    <ShoppingBag />
                    <span>Checkout</span>
                </Button>
            </div>
        </div>
    )
}
export default CartList