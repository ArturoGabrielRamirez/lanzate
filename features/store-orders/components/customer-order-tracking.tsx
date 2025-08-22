"use client"

import { Order, Store, OrderPayment, Product, OrderItem, OrderTracking, Branch } from "@prisma/client"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import OrderDetailsStatus from "./order-details-status"
import OrderDetailsAccordions from "@/features/orders/components/order-details-accordions"
import OrderDetailsArrival from "./order-details-arrival"
import OrderDetailsStore from "./order-details-store"

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
            <div className="lg:grid lg:grid-cols-[2fr_1fr_1fr] gap-4 mb-4">
                <OrderDetailsStatus order={currentOrder} />
                <OrderDetailsArrival order={currentOrder} />
                <OrderDetailsStore order={currentOrder} />
            </div>
            <OrderDetailsAccordions order={currentOrder} />
        </div>
    )
}

export default CustomerOrderTracking 