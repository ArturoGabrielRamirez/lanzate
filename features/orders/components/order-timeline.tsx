"use client"

import { Order, OrderItem, OrderPayment, OrderTracking, Product, Store } from "@prisma/client"
import ConfirmOrderButton from "./confirm-order-button"
import OrderReadyButton from "./order-ready-button"
import PickedUpOrderButton from "./picked-up-order-button"
import FinalizeOrderButton from "./finalize-order-button"
import { CancelOrderButton } from "@/features/stores/components"
import OrderTimelineIcons from "./order-timeline-icons"
import OpenChatButton from "./open-chat-button"

type Props = {
    order: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment } & { store: Store }
}

const OrderTimeline = ({ order }: Props) => {

    return (
        <div className="grow flex flex-col">
            <OrderTimelineIcons order={order} />
            <div className="grow flex flex-col gap-2">
                <div className="grow flex flex-col justify-center items-center text-center">
                    {order.status === "PROCESSING" && (
                        <>
                            <p className="text-lg font-bold">New order placed</p>
                            <p className="text-muted-foreground mb-4">A new order was just placed. Check you have enough in-store stock and confirm the order!</p>
                            <ConfirmOrderButton order={order} canUpdateOrders={true} />
                        </>
                    )}
                    {order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" && (
                        <>
                            <p className="text-lg font-bold">Order confirmed</p>
                            <p className="text-muted-foreground mb-4">The order was just marked as confirmed. You should start packing the order!</p>
                            <OrderReadyButton order={order} />
                        </>
                    )}
                    {order.status === "READY" && order.tracking?.tracking_status === "WAITING_FOR_PICKUP" && (
                        <>
                            <p className="text-lg font-bold">Ready for pickup</p>
                            <p className="text-muted-foreground mb-4">The order is at store waiting for the customer to pick it up. You should contact the customer if it&apos;s been more than 10 minutes and the order hasn&apos;t been picked up.</p>
                            <FinalizeOrderButton order={order} />
                        </>
                    )}
                    {order.status === "READY" && order.tracking?.tracking_status === "WAITING_FOR_DELIVERY" && (
                        <>
                            <p className="text-lg font-bold">Ready for delivery</p>
                            <p className="text-muted-foreground mb-4">The store is waiting for the delivery driver to pick up the order. You should contact the delivery driver if it&apos;s been more than 10 minutes and the order hasn&apos;t been picked up.</p>
                            <PickedUpOrderButton order={order} />
                        </>
                    )}
                    {order.status === "READY" && order.tracking?.tracking_status === "ON_THE_WAY" && (
                        <>
                            <p className="text-lg font-bold">On the way</p>
                            <p className="text-muted-foreground mb-4">The order is on the way to the customer&apos;s address. You should contact the customer if it&apos;s been more than 15 minutes and the order hasn&apos;t arrived yet.</p>
                            <FinalizeOrderButton order={order} />
                        </>
                    )}
                    {order.status === "COMPLETED" && (
                        <>
                            <p className="text-lg font-bold">Order completed</p>
                            <p className="text-muted-foreground mb-4">The order has been completed. You should contact the customer if they have any issues with the order.</p>
                        </>
                    )}
                </div>
                <CancelOrderButton order={order} slug={order.store.slug} className="w-full" />
                <OpenChatButton roomId={String(order.id)} />
            </div>
        </div>
    )
}

export default OrderTimeline