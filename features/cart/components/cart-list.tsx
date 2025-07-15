"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

function CartList() {

    const { cart } = useCart()
    console.log("🚀 ~ CartList ~ cart:", cart)

    return (
        <div>
            {cart.map((item) => (
                <Card key={item.id} className="rounded-none border-t-0 border-x-0 border-b-2 border-border pb-2">
                    <CardHeader className="pl-0">
                        <CardTitle>
                            <h3>{item.name}</h3>
                        </CardTitle>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center pl-0">
                        <p className="text-sm text-muted-foreground">
                            ${item.price} x {item.quantity} {item.quantity > 1 ? "items" : "item"}
                        </p>
                        <Button variant="ghost" size="icon">
                            <Trash2 />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
export default CartList