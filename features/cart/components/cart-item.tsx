"use client"

import { Trash2 } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { useCart } from "@/features/cart/components"
import { CartItemProps } from "@/features/cart/types"
import { Button } from "@/features/shadcn/components/ui/button"

function CartItem({ item }: CartItemProps) {

    const t = useTranslations("cart.item")

    const { removeFromCart } = useCart()

    const handleRemove = () => {
        removeFromCart(item.id)
    }

    return (
        <div className="grid grid-cols-[max-content_1fr] gap-2 border-b border-b-muted-foreground/20 pb-2">
            <div className="relative aspect-square">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name || "Product Image"}
                        fill
                        className="rounded-md"
                    />
                ) : (
                    <Image src="https://api.dicebear.com/9.x/icons/svg?seed=boxes" alt="Product Image" className="object-cover h-full w-full bg-center group-hover:scale-105 transition-all duration-300 scale-y-95 scale-x-93 rounded-md max-w-20" width={48} height={48} fill />
                )}
            </div>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        ${item.price} x {item.quantity} {item.quantity > 1 ? t("items") : t("item")}
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