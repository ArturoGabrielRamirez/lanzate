"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "./cart-provider"

function CartResume() {

    const { quantity, total } = useCart()

    return (
        <Card className="flex-1 max-w-sm xl:max-w-md bg-accent text-accent-foreground w-full grow">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Cart Resume</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <p className="grid grid-cols-[max-content_1fr_min-content] gap-2">
                        <span className="w-max text-sm text-muted-foreground">Quantity: </span>
                        <span className="border-dotted w-full border-2 border-t-0 border-r-0 border-l-0 relative bottom-2"></span>
                        <span className="w-max text-sm">{quantity} {quantity > 1 ? "items" : "item"}</span>
                    </p>
                    <p className="grid grid-cols-[max-content_1fr_min-content] gap-2">
                        <span className="w-max text-sm text-muted-foreground">Sub Total: </span>
                        <span className="border-dotted w-full border-2 border-t-0 border-r-0 border-l-0 relative bottom-2"></span>
                        <span>{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(total)}</span>
                    </p>
                    <p className="grid grid-cols-[max-content_1fr_min-content] gap-2">
                        <span className="w-max text-sm text-muted-foreground">Shipping: </span>
                        <span className="border-dotted w-full border-2 border-t-0 border-r-0 border-l-0 relative bottom-2"></span>
                        <span>{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(0)}</span>
                    </p>
                    <p className="grid grid-cols-[max-content_1fr_min-content] gap-2">
                        <span className="w-max text-sm text-muted-foreground">Discount: </span>
                        <span className="border-dotted w-full border-2 border-t-0 border-r-0 border-l-0 relative bottom-2"></span>
                        <span>{Intl.NumberFormat("es-AR", { style: "percent", currency: "ARS" }).format(0)}</span>
                    </p>
                </div>
                <div className="bg-primary h-px w-full my-4"></div>
                <p className="font-bold text-lg text-right">
                    Total: {Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(total)}
                </p>
            </CardContent>
        </Card>
    )
}
export default CartResume