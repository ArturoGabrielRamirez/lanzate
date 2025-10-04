"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { OrderTrackingStatus } from "@prisma/client"

type InsertOrderTrackingProps = {
    order_id: number
    tracking_status?: OrderTrackingStatus
}

export async function insertOrderTracking({
    order_id,
    tracking_status = "PREPARING_ORDER"
}: InsertOrderTrackingProps) {
    return actionWrapper(async () => {
        const orderTracking = await prisma.orderTracking.create({
            data: {
                order_id: order_id,
                tracking_status: tracking_status
            }
        })

        return {
            error: false,
            message: "Order tracking created successfully",
            payload: orderTracking
        }
    })
} 