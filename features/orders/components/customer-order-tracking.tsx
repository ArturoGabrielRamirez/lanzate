"use client"

import { OrderTracking } from "@prisma/client"
import { useEffect, useState } from "react"

import { OrderDetailsAccordions } from "@/features/orders/components/order-details-accordions"
import { OrderDetailsArrival } from "@/features/orders/components/order-details-arrival"
import { OrderDetailsStatus } from "@/features/orders/components/order-details-status"
import { OrderDetailsStore } from "@/features/orders/components/order-details-store"
import { CustomerOrderTrackingProps } from "@/features/orders/types"
import { createClient } from "@/utils/supabase/client"

function CustomerOrderTracking({ order }: CustomerOrderTrackingProps) {
    const [currentOrder, setCurrentOrder] = useState(order)

    useEffect(() => {
        const supabase = createClient()

        const changes = supabase
            .channel('public-order-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: "orders"
                },
                (payload) => {
                    if (payload.new && payload.new.id === order.id) {
                        setCurrentOrder(prevOrder => ({
                            ...prevOrder,
                            ...payload.new
                        }))
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: "order_tracking"
                },
                (payload) => {

                    if (payload.new && payload.new.order_id === order.id) {
                        setCurrentOrder(prevOrder => ({
                            ...prevOrder,
                            tracking: payload.new as OrderTracking
                        }))
                    }
                }
            )
            .subscribe((status) => {
                console.log("📡 Subscription status:", status)
            })

        return () => {
            changes.unsubscribe()
        }
    }, [order.id])

    useEffect(() => {
        setCurrentOrder(order)
    }, [order])

    return (
        <div className="">
            <div className="grid lg:grid-cols-[2fr_1fr_1fr] gap-4 mb-4">
                <OrderDetailsStatus order={currentOrder} />
                <OrderDetailsArrival order={currentOrder} />
                <OrderDetailsStore order={currentOrder} />
            </div>
            <OrderDetailsAccordions order={currentOrder} />
        </div>
    )
}

export { CustomerOrderTracking }