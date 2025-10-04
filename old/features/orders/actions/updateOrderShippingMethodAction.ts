"use server"

import { actionWrapper } from "@/utils/lib"
import { updateOrderShippingMethod } from "../data/updateOrderShippingMethod"
import { revalidatePath } from "next/cache"

type UpdateOrderShippingMethodActionProps = {
    orderId: string
    newShippingMethod: "PICKUP" | "DELIVERY"
    pathname: string
}

export async function updateOrderShippingMethodAction({ orderId, newShippingMethod, pathname }: UpdateOrderShippingMethodActionProps) {
    return actionWrapper(async () => {
        const { payload: updatedOrder, error, message } = await updateOrderShippingMethod({ orderId, newShippingMethod })
        
        if (error) throw new Error(message)
        
        revalidatePath(pathname)
        
        return {
            message: "Order shipping method updated successfully",
            payload: updatedOrder,
            error: false
        }
    })
} 