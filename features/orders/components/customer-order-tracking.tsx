"use client"

import { Order, Store, OrderPayment, Product, OrderItem, OrderTracking, Branch } from "@prisma/client"
import { useEffect, useState } from "react"

import { OrderDetailsAccordions } from "@/features/orders/components/order-details-accordions"
import { OrderDetailsArrival } from "@/features/orders/components/order-details-arrival"
import { OrderDetailsStatus } from "@/features/orders/components/order-details-status"
import { OrderDetailsStore } from "@/features/orders/components/order-details-store"
import { createClient } from "@/utils/supabase/client"

type Props = {
    order: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment } & { store: Store } & { branch: Branch }
}

function CustomerOrderTracking({ order }: Props) {
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
                (payload: { new: Order | null }) => {
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
                (payload: { new: OrderTracking | null }) => {

                    if (payload.new && payload.new.order_id === order.id) {
                        setCurrentOrder(prevOrder => ({
                            ...prevOrder,
                            tracking: payload.new as OrderTracking
                        }))
                    }
                }
            )
            .subscribe((status: { new: OrderTracking | null }) => {
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