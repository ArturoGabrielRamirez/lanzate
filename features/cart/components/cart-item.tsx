"use client"

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
        <Card key={item.id} className="rounded-none border-t-0 border-x-0 border-b-2 border-border pb-2 shadow-none">
            <CardHeader className="pl-0">
                <CardTitle>
                    <h3>{item.name}</h3>
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex justify-between items-center pl-0">
                <p className="text-sm text-muted-foreground">
                    ${item.price} x {item.quantity} {item.quantity > 1 ? "items" : "item"}
                </p>
                <Button variant="destructive" size="icon" onClick={handleRemove}>
                    <Trash2 />
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CartItem