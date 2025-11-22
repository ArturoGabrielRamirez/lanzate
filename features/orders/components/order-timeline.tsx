"use client"

import { CancelOrderButton, ConfirmOrderButton } from "@/features/orders/components"
import { OrderReadyButton } from "@/features/orders/components"
import { PickedUpOrderButton } from "@/features/orders/components"
import { FinalizeOrderButton } from "@/features/orders/components"
import { OrderTimelineIcons } from "@/features/orders/components"
import { OpenChatButton } from "@/features/orders/components"
import { OrderTimelineProps } from "@/features/orders/types"

function OrderTimeline({ order }: OrderTimelineProps) {

    return (
        <div className="grow flex flex-col">
            <OrderTimelineIcons order={order} />
            <div className="grow flex flex-col gap-2">
                <div className="grow flex flex-col justify-center items-center text-center">
                    {order.status === "PROCESSING" && (
                        <>
                            <p className="text-lg font-bold">Nuevo pedido realizado</p>
                            <p className="text-muted-foreground mb-4">Un nuevo pedido acaba de realizarse. Verificá que tengas suficiente stock en la tienda y confirmá el pedido.</p>
                            <ConfirmOrderButton order={order} canUpdateOrders={true} />
                        </>
                    )}
                    {order.status === "READY" && order.tracking?.tracking_status === "PREPARING_ORDER" && (
                        <>
                            <p className="text-lg font-bold">Pedido confirmado</p>
                            <p className="text-muted-foreground mb-4">El pedido acaba de ser confirmado. ¡Deberías comenzar a prepararlo!</p>
                            <OrderReadyButton order={order} />
                        </>
                    )}
                    {order.status === "READY" && order.tracking?.tracking_status === "WAITING_FOR_PICKUP" && (
                        <>
                            <p className="text-lg font-bold">Listo para retirar</p>
                            <p className="text-muted-foreground mb-4">El pedido está en la tienda esperando que el cliente lo retire.</p>
                            <FinalizeOrderButton order={order} />
                        </>
                    )}
                    {order.status === "READY" && order.tracking?.tracking_status === "WAITING_FOR_DELIVERY" && (
                        <>
                            <p className="text-lg font-bold">Listo para la entrega</p>
                            <p className="text-muted-foreground mb-4">La tienda está esperando que el repartidor recoja el pedido.</p>
                            <PickedUpOrderButton order={order} />
                        </>
                    )}
                    {order.status === "READY" && order.tracking?.tracking_status === "ON_THE_WAY" && (
                        <>
                            <p className="text-lg font-bold">En camino</p>
                            <p className="text-muted-foreground mb-4">El pedido está en camino a la dirección del cliente.</p>
                            <FinalizeOrderButton order={order} />
                        </>
                    )}
                    {order.status === "COMPLETED" && (
                        <>
                            <p className="text-lg font-bold">Pedido completado</p>
                            <p className="text-muted-foreground mb-4">El pedido está completado.</p>
                        </>
                    )}
                </div>
                <CancelOrderButton order={order} slug={order.store.slug} className="w-full" />
                <OpenChatButton roomId={String(order.id)} username="Store" messageType="STORE_TO_CUSTOMER" />
            </div>
        </div>
    )
}

export { OrderTimeline }