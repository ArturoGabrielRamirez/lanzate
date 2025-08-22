"use client"

import { Order, Store, OrderPayment, Product, OrderItem, OrderTracking } from "@prisma/client"
import OrderTimelineIcons from "@/features/orders/components/order-timeline-icons"
import { CircleCheck, Clock, ShoppingBag, MapPin, PartyPopper, Truck, Store as StoreIcon } from "lucide-react"
import { RealtimeChat } from "@/components/realtime-chat"
import { useEffect, useState } from "react"
import { fetchOrderMessages } from "@/features/chat/actions/getOrderMessages"
import { ChatMessage } from "@/hooks/use-realtime-chat"
import { Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import OrderDetailsStatus from "./order-details-status"
import OrderDetailsAccordions from "@/features/orders/components/order-details-accordions"

type Props = {
    order: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment } & { store: Store }
}

function CustomerOrderTracking({ order }: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(true)
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

    // Cargar mensajes previos cuando el componente se monta
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const { payload: orderMessages, error } = await fetchOrderMessages(order.id)

                if (error) {
                    console.error('Error loading messages:', error)
                }

                setMessages(orderMessages || [])
            } catch (error) {
                console.error('Error loading messages:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadMessages()
    }, [order.id])

    // Update currentOrder when the prop order changes
    useEffect(() => {
        setCurrentOrder(order)
    }, [order])

    const isProcessing = currentOrder.status === "PROCESSING"
    const isReady = currentOrder.status === "READY"
    const isCompleted = currentOrder.status === "COMPLETED"
    const isDelivery = currentOrder.shipping_method === "DELIVERY"
    const isPickup = currentOrder.shipping_method === "PICKUP"

    const isPreparingOrder = isReady && currentOrder.tracking?.tracking_status === "PREPARING_ORDER"
    const isWaitingForDelivery = isReady && currentOrder.tracking?.tracking_status === "WAITING_FOR_DELIVERY"
    const isOnTheWay = currentOrder.tracking?.tracking_status === "ON_THE_WAY"
    const isWaitingForPickup = isReady && currentOrder.tracking?.tracking_status === "WAITING_FOR_PICKUP"

    // Determine which steps are completed
    const isOrderPlacedCompleted = isReady || isCompleted
    const isOrderConfirmedCompleted = isPreparingOrder || isWaitingForDelivery || isWaitingForPickup || isOnTheWay || isCompleted
    const isOrderPackedCompleted = isWaitingForDelivery || isWaitingForPickup || isOnTheWay || isCompleted
    const isDeliveryReadyCompleted = isOnTheWay || isCompleted
    const isOnTheWayCompleted = isCompleted
    const isPickupReadyCompleted = isCompleted
    const isOrderCompletedCompleted = isCompleted

    // Determine which steps are future (not yet reached)
    const isOrderPlacedFuture = !isProcessing && !isOrderPlacedCompleted
    const isOrderConfirmedFuture = !isReady && !isOrderConfirmedCompleted
    const isOrderPackedFuture = !isPreparingOrder && !isOrderPackedCompleted
    const isDeliveryReadyFuture = isDelivery && !isWaitingForDelivery && !isDeliveryReadyCompleted
    const isOnTheWayFuture = isDelivery && !isOnTheWay && !isOnTheWayCompleted
    const isPickupReadyFuture = isPickup && !isWaitingForPickup && !isPickupReadyCompleted
    const isOrderCompletedFuture = !isCompleted



    return (
        <div className="">
            <div className="lg:grid lg:grid-cols-[2fr_1fr_1fr] gap-4 mb-4">
                <OrderDetailsStatus order={currentOrder} />
                <Card className="hidden lg:block">
                    
                </Card>
                <Card className="hidden lg:block">
                    
                </Card>
            </div>
            <OrderDetailsAccordions order={currentOrder} />
            {/* <div className="flex gap-8 flex-col w-full items-start">
                <OrderTimelineIcons order={currentOrder} />
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 rounded-full p-2 ${isProcessing ? 'bg-green-600' : 'bg-muted'}`}>
                            <Clock className={`w-4 h-4 ${isProcessing ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                            <h5 className={`font-medium ${isProcessing ? 'text-base' : 'text-sm'} ${isProcessing ? 'text-foreground' : 'text-muted-foreground'} ${isOrderPlacedCompleted && !isProcessing ? 'line-through' : ''} ${isOrderPlacedFuture ? 'opacity-50' : ''}`}>
                                Order Placed
                            </h5>
                            <p className={`${isProcessing ? 'text-sm' : 'text-xs'} ${isProcessing ? 'text-muted-foreground' : 'text-muted-foreground/70'} ${isOrderPlacedCompleted && !isProcessing ? 'line-through' : ''} ${isOrderPlacedFuture ? 'opacity-50' : ''}`}>
                                Your order has been received
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 rounded-full p-2 ${isReady ? 'bg-green-600' : 'bg-muted'}`}>
                            <CircleCheck className={`w-4 h-4 ${isReady ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                            <h5 className={`font-medium ${isReady ? 'text-base' : 'text-sm'} ${isReady ? 'text-foreground' : 'text-muted-foreground'} ${isOrderConfirmedCompleted && !isReady ? 'line-through' : ''} ${isOrderConfirmedFuture ? 'opacity-50' : ''}`}>
                                Order Confirmed
                            </h5>
                            <p className={`${isReady ? 'text-sm' : 'text-xs'} ${isReady ? 'text-muted-foreground' : 'text-muted-foreground/70'} ${isOrderConfirmedCompleted && !isReady ? 'line-through' : ''} ${isOrderConfirmedFuture ? 'opacity-50' : ''}`}>
                                Your order has been confirmed and is being prepared
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 rounded-full p-2 ${isPreparingOrder ? 'bg-green-600' : 'bg-muted'}`}>
                            <ShoppingBag className={`w-4 h-4 ${isPreparingOrder ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                            <h5 className={`font-medium ${isPreparingOrder ? 'text-base' : 'text-sm'} ${isPreparingOrder ? 'text-foreground' : 'text-muted-foreground'} ${isOrderPackedCompleted && !isPreparingOrder ? 'line-through' : ''} ${isOrderPackedFuture ? 'opacity-50' : ''}`}>
                                Order Being Packed
                            </h5>
                            <p className={`${isPreparingOrder ? 'text-sm' : 'text-xs'} ${isPreparingOrder ? 'text-muted-foreground' : 'text-muted-foreground/70'} ${isOrderPackedCompleted && !isPreparingOrder ? 'line-through' : ''} ${isOrderPackedFuture ? 'opacity-50' : ''}`}>
                                The order is being packed. Once it&apos;s done, it will be ready for {isDelivery ? 'delivery' : 'pickup'}
                            </p>
                        </div>
                    </div>

                    {isDelivery && (
                        <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 rounded-full p-2 ${isWaitingForDelivery ? 'bg-green-600' : 'bg-muted'}`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-4 h-4 ${isWaitingForDelivery ? 'text-white' : 'text-muted-foreground'}`}
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M19.5 19.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M14.5 19.5h-5m10 0h.763c.22 0 .33 0 .422-.012a1.5 1.5 0 0 0 1.303-1.302c.012-.093.012-.203.012-.423V15a6.5 6.5 0 0 0-6.5-6.5M11 6h1c1.414 0 2.121 0 2.56.44C15 6.878 15 7.585 15 9v8.5M2 12v5c0 .935 0 1.402.201 1.75a1.5 1.5 0 0 0 .549.549c.348.201.815.201 1.75.201M7.85 7.85l-1.35-.9V4.7M2 6.5a4.5 4.5 0 1 0 9 0a4.5 4.5 0 0 0-9 0"></path></g>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h5 className={`font-medium ${isWaitingForDelivery ? 'text-base' : 'text-sm'} ${isWaitingForDelivery ? 'text-foreground' : 'text-muted-foreground'} ${isDeliveryReadyCompleted && !isWaitingForDelivery ? 'line-through' : ''} ${isDeliveryReadyFuture ? 'opacity-50' : ''}`}>
                                    Ready for Delivery
                                </h5>
                                <p className={`${isWaitingForDelivery ? 'text-sm' : 'text-xs'} ${isWaitingForDelivery ? 'text-muted-foreground' : 'text-muted-foreground/70'} ${isDeliveryReadyCompleted && !isWaitingForDelivery ? 'line-through' : ''} ${isDeliveryReadyFuture ? 'opacity-50' : ''}`}>
                                    The order is ready for delivery and is waiting for the delivery driver to pick it up
                                </p>
                            </div>
                        </div>
                    )}

                    {isDelivery && (
                        <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 rounded-full p-2 ${isOnTheWay ? 'bg-green-600' : 'bg-muted'}`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`w-4 h-4 ${isOnTheWay ? 'text-white' : 'text-muted-foreground'}`}
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" strokeWidth={1.5}>
                                        <path d="M19.5 17.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 17.5h-5m10 0h.763c.22 0 .33 0 .422-.012a1.5 1.5 0 0 0 1.303-1.302c.012-.093.012-.203.012-.423V13a6.5 6.5 0 0 0-6.5-6.5M2 4h10c1.414 0 2.121 0 2.56.44C15 4.878 15 5.585 15 7v8.5M2 12.75V15c0 .935 0 1.402.201 1.75a1.5 1.5 0 0 0 .549.549c.348.201.815.201 1.75.201M2 7h6m-6 3h4"></path>
                                    </g>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h5 className={`font-medium ${isOnTheWay ? 'text-base' : 'text-sm'} ${isOnTheWay ? 'text-foreground' : 'text-muted-foreground'} ${isOnTheWayCompleted && !isOnTheWay ? 'line-through' : ''} ${isOnTheWayFuture ? 'opacity-50' : ''}`}>
                                    On the Way
                                </h5>
                                <p className={`${isOnTheWay ? 'text-sm' : 'text-xs'} ${isOnTheWay ? 'text-muted-foreground' : 'text-muted-foreground/70'} ${isOnTheWayCompleted && !isOnTheWay ? 'line-through' : ''} ${isOnTheWayFuture ? 'opacity-50' : ''}`}>
                                    The order is on the way to your address
                                </p>
                            </div>
                        </div>
                    )}

                    {isPickup && (
                        <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 rounded-full p-2 ${isWaitingForPickup ? 'bg-green-600' : 'bg-muted'}`}>
                                <MapPin className={`w-4 h-4 ${isWaitingForPickup ? 'text-white' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1">
                                <h5 className={`font-medium ${isWaitingForPickup ? 'text-base' : 'text-sm'} ${isWaitingForPickup ? 'text-foreground' : 'text-muted-foreground'} ${isPickupReadyCompleted && !isWaitingForPickup ? 'line-through' : ''} ${isPickupReadyFuture ? 'opacity-50' : ''}`}>
                                    Ready for Pickup
                                </h5>
                                <p className={`${isWaitingForPickup ? 'text-sm' : 'text-xs'} ${isWaitingForPickup ? 'text-muted-foreground' : 'text-muted-foreground/70'} ${isPickupReadyCompleted && !isWaitingForPickup ? 'line-through' : ''} ${isPickupReadyFuture ? 'opacity-50' : ''}`}>
                                    The order is ready for pickup and is waiting for you to pick it up
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 rounded-full p-2 ${isCompleted ? 'bg-green-600' : 'bg-muted'}`}>
                            <PartyPopper className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                            <h5 className={`font-medium ${isCompleted ? 'text-base' : 'text-sm'} ${isCompleted ? 'text-foreground' : 'text-muted-foreground'} ${isOrderCompletedCompleted && !isCompleted ? 'line-through' : ''} ${isOrderCompletedFuture ? 'opacity-50' : ''}`}>
                                Order Completed
                            </h5>
                            <p className={`${isCompleted ? 'text-sm' : 'text-xs'} ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/70'} ${isOrderCompletedCompleted && !isCompleted ? 'line-through' : ''} ${isOrderCompletedFuture ? 'opacity-50' : ''}`}>
                                The order was completed. Enjoy your purchase!
                            </p>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* <div className="w-full">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8 border rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                            <span className="text-sm">Loading chat messages...</span>
                        </div>
                    </div>
                ) : (
                    <RealtimeChat
                        roomName={String(currentOrder.id)}
                        username="Customer"
                        messageType="CUSTOMER_TO_STORE"
                        messages={messages}
                        disabled={currentOrder.status === "COMPLETED"}
                        emptyStateText="No hay mensajes aún. ¡Inicia la conversación!"
                        completedOrderText="Esta orden ha sido completada y ya no puedes enviar más mensajes a la tienda."
                    />
                )}
            </div> */}
        </div>
    )
}

export default CustomerOrderTracking 