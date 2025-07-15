"use client"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingBag, CircleX } from "lucide-react"

function CartList() {

    const { cart } = useCart()

    return (
        <div className="flex-1">
            {cart.map((item) => (
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
                        <Button variant="destructive" size="icon">
                            <Trash2 />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
            <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline">
                    <CircleX />
                    <span>Cancel</span>
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