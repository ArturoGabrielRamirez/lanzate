"use client"

import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingBag } from "lucide-react"
import CartItem from "./cart-item"
import Link from "next/link"
import { useTranslations } from "next-intl"

function CartList() {

    const t = useTranslations("cart")

    const { cart, clearCart } = useCart()

    return (
        <div className="flex-1">
            <div className="flex flex-col gap-3">
                {cart.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>
            {cart.length > 0 && (
                <div className="flex gap-2 justify-end mt-4">
                    <Button variant="outline" onClick={clearCart} >
                        <Trash2 />
                        <span>{t("buttons.remove")}</span>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/checkout">
                            <ShoppingBag />
                            <span>{t("buttons.checkout")}</span>
                        </Link>
                    </Button>
                </div>
            )}
            {cart.length === 0 && (
                <div className="border-muted-foreground/20 border-2 rounded-md p-4 border-dashed">
                    <p className="text-muted-foreground text-center">{t("description.no-items")}</p>
                </div>
            )}
        </div>
    )
}
export default CartList