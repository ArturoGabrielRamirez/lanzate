"use client"
import { useCart } from "./cart-provider"

function CartResume() {

    const { quantity, total } = useCart()

    return (
        <div className="flex-1 max-w-sm xl:max-w-md">
            <h2>Cart Resume</h2>
            <p>Total: {total}</p>
            <p>Quantity: {quantity}</p>
        </div>
    )
}
export default CartResume