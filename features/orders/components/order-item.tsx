import Image from "next/image"

import { OrderItemComponentProps } from "@/features/orders/types"

function OrderItemComponent({ item }: OrderItemComponentProps) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-muted last:border-b-0">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                    {item.product.image ? (
                        <Image
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-md"
                            fill
                        />
                    ) : (
                        <span className="text-muted-foreground text-xs">No hay imagen disponible</span>
                    )}
                </div>
                <div>
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-muted-foreground text-xs">
                        Cantidad: {item.quantity}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-medium text-sm">
                    ${item.price.toFixed(2)}
                </p>
                <p className="text-muted-foreground text-xs">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                </p>
            </div>
        </div>
    )
}

export { OrderItemComponent }