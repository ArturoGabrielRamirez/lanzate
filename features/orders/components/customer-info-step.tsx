"use client"

import { OrderTrackingStatus } from "@prisma/client"
import { User, Mail, Phone, MapPin, MessageCircle, Check, Package, Truck, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { finalizeOrderAction } from "@/features/orders/actions/finalize-order.action"
import { updateOrderTrackingAction } from "@/features/orders/actions/update-order-tracking.action"
import { CustomerInfoStepProps } from "@/features/orders/types"
import { Alert, AlertDescription } from "@/features/shadcn/components/ui/alert"
import { Button } from "@/features/shadcn/components/ui/button"
import { cn } from "@/lib/utils"

function CustomerInfoStep({ order, employeePermissions }: CustomerInfoStepProps) {
    const [isPending, startTransition] = useTransition()
    const [isFinalizing, startFinalizeTransition] = useTransition()
    const isPickup = order.shipping_method === "PICKUP"
    const isCompleted = order.status === "COMPLETED"
    const currentTrackingStatus = order.tracking?.tracking_status

    // Check if user can update orders
    const canUpdateOrders = employeePermissions.isAdmin || employeePermissions.permissions?.can_update_orders

    const handleWhatsAppClick = () => {
        if (order.customer_phone) {
            const phoneNumber = order.customer_phone.replace(/\D/g, '')
            const message = `Hi ${order.customer_name || 'there'}! Your order #${order.id} is ready for pickup.`
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
            window.open(whatsappUrl, '_blank')
        }
    }

    const handleEmailClick = () => {
        // TODO: Implement email functionality
        console.log("Funcionalidad de email por implementar")
    }

    const handleTrackingUpdate = (newStatus: OrderTrackingStatus) => {
        startTransition(async () => {
            try {
                const result = await updateOrderTrackingAction({
                    orderId: order.id.toString(),
                    newTrackingStatus: newStatus
                })

                if (result.hasError) {
                    toast.error(result.message)
                } else {
                    toast.success("Seguimiento de la orden actualizado con éxito")
                }
            } catch (error) {
                console.error("Error updating order tracking:", error)
                toast.error("Error al actualizar el seguimiento de la orden")
            }
        })
    }

    const handleFinalize = () => {
        startFinalizeTransition(async () => {
            try {
                const result = await finalizeOrderAction({
                    orderId: order.id.toString(),
                    shippingMethod: order.shipping_method
                })

                if (result.hasError) {
                    toast.error(result.message)
                } else {
                    const actionText = isPickup ? "recogida" : "entregada"
                    toast.success(`Orden finalizada con éxito! La orden ha sido marcada como ${actionText}.`)
                }
            } catch (error) {
                console.error("Error finalizing order:", error)
                toast.error("Error al finalizar la orden")
            }
        })
    }

    const getTrackingStatusInfo = () => {
        if (!currentTrackingStatus) return null

        const statusConfig = {
            PREPARING_ORDER: {
                icon: Package,
                title: "Preparando Orden",
                description: "La orden está siendo preparada y estará lista pronto. Marcar como lista cuando la orden esté lista para ser recogida o entregada",
                color: "text-blue-600"
            },
            WAITING_FOR_PICKUP: {
                icon: Clock,
                title: "Lista para Buscar",
                description: "La orden está lista! El cliente fue notificado y puede venir a buscarla",
                color: "text-green-600"
            },
            PICKED_UP: {
                icon: CheckCircle2,
                title: "Orden Recogida",
                description: "La orden fue recogida con éxito por el cliente",
                color: "text-green-600"
            },
            WAITING_FOR_DELIVERY: {
                icon: Package,
                title: "Lista para Entregar",
                description: "La orden está lista y esperando ser entregada",
                color: "text-green-600"
            },
            ON_THE_WAY: {
                icon: Truck,
                title: "En Camino",
                description: "La orden está en camino hacia el cliente",
                color: "text-orange-600"
            },
            DELIVERED: {
                icon: CheckCircle2,
                title: "Orden Entregada",
                description: "La orden fue entregada con éxito al cliente",
                color: "text-green-600"
            },
            CANCELLED: {
                icon: Check,
                title: "Orden Cancelada",
                description: "La orden fue cancelada",
                color: "text-red-600"
            }
        }

        return statusConfig[currentTrackingStatus]
    }

    const getTrackingButtons = () => {
        if (!currentTrackingStatus) return null

        if (!canUpdateOrders) {
            return (
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        No tenés permisos suficientes para actualizar el estado de esta orden. Por favor, contactá a un administrador.
                    </AlertDescription>
                </Alert>
            )
        }

        if (isPickup) {
            return (
                <div className="space-y-2">
                    {currentTrackingStatus === "PREPARING_ORDER" && (
                        <Button
                            onClick={() => handleTrackingUpdate("WAITING_FOR_PICKUP")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            {isPending ? "Actualizando..." : "Lista para Buscar"}
                        </Button>
                    )}
                    {currentTrackingStatus === "WAITING_FOR_PICKUP" && (
                        <Button
                            onClick={() => handleTrackingUpdate("PREPARING_ORDER")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <Package className="w-4 h-4 mr-2" />
                            {isPending ? "Actualizando..." : "Volver a Preparar"}
                        </Button>
                    )}
                    <Button
                        onClick={handleFinalize}
                        disabled={isFinalizing}
                        className="w-full"
                        variant="default"
                    >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {isFinalizing ? "Finalizando..." : "Finalizar"}
                    </Button>
                </div>
            )
        } else {
            return (
                <div className="space-y-2">
                    {currentTrackingStatus === "PREPARING_ORDER" && (
                        <Button
                            onClick={() => handleTrackingUpdate("WAITING_FOR_DELIVERY")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <Package className="w-4 h-4 mr-2" />
                            {isPending ? "Actualizando..." : "Esperando Delivery"}
                        </Button>
                    )}
                    {currentTrackingStatus === "WAITING_FOR_DELIVERY" && (
                        <Button
                            onClick={() => handleTrackingUpdate("ON_THE_WAY")}
                            disabled={isPending}
                            className="w-full"
                            variant="outline"
                        >
                            <Truck className="w-4 h-4 mr-2" />
                            {isPending ? "Actualizando..." : "En Camino"}
                        </Button>
                    )}
                    {currentTrackingStatus !== "ON_THE_WAY" && (
                        <Button
                            onClick={handleFinalize}
                            disabled={isFinalizing}
                            className="w-full"
                            variant="default"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {isFinalizing ? "Finalizando..." : "Finalizar"}
                        </Button>
                    )}
                </div>
            )
        }
    }

    const formatAddress = () => {
        const parts = [
            order.address_one,
            order.address_two,
            order.city,
            order.state,
            order.zip_code,
            order.country
        ].filter(Boolean)

        return parts.join(', ')
    }

    const trackingInfo = getTrackingStatusInfo()

    return (
        <div className="space-y-6">
            {/* Success Message for Completed Orders */}
            {isCompleted && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
                    <div className="flex items-center gap-3 flex-col">
                        <div className="flex-shrink-0 rounded-full border border-green-600  p-2">
                            <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-green-800 font-medium">
                                ¡Orden Finalizada con Éxito!
                            </h3>
                            <p className="text-green-700 text-sm mt-1">
                                {isPickup
                                    ? "El cliente recogió su orden con éxito."
                                    : "La orden fue entregada al cliente con éxito."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Tracking Status */}

            {/* Order Tracking Controls */}
            {currentTrackingStatus && !isCompleted && (
                <div className="space-y-3">
                    <h4 className="font-medium">Seguimiento de la Orden</h4>
                    {trackingInfo && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 rounded-full border border-blue-600 p-2 ${trackingInfo.color}`}>
                                    <trackingInfo.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={`font-medium ${trackingInfo.color}`}>
                                        {trackingInfo.title}
                                    </h3>
                                    <p className="text-blue-700 text-sm mt-1">
                                        {trackingInfo.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {getTrackingButtons()}
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold mb-4">Información del Cliente</h3>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        <span className="font-medium">{order.customer_name || 'No se proporcionó el nombre'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Mail className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{order.customer_email || "No se proporcionó el email"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Phone className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{order.customer_phone || "No se proporcionó el teléfono"}</span>
                    </div>

                    {!isPickup && order.address_one && (
                        <div className="flex items-start gap-2">
                            <MapPin className="size-4 text-muted-foreground mt-0.5" />
                            <div className="text-muted-foreground">
                                <p className="font-medium">Dirección de Entrega:</p>
                                <p>{formatAddress()}</p>
                            </div>
                        </div>
                    )}

                    {isPickup && order.branch && (
                        <div className="flex items-start gap-2">
                            <MapPin className="size-4 text-muted-foreground mt-0.5" />
                            <div className="text-muted-foreground">
                                <p>{order.branch.name}</p>
                                <p>{order.branch.address}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isPickup ? (
                <div className="space-y-3">
                    <h4 className="font-medium">Contactar al Cliente</h4>
                    <div className="flex gap-2">
                        <div className={cn(
                            "w-full",
                            !order.customer_phone && "opacity-50 cursor-not-allowed"
                        )}>
                            <Button
                                onClick={handleWhatsAppClick}
                                className={cn("w-full")}
                                variant="outline"
                                disabled={!order.customer_phone}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Enviar Mensaje de WhatsApp (Próximamente)
                            </Button>
                        </div>
                        <div className={cn(
                            "w-full",
                            !order.customer_email && "opacity-50 cursor-not-allowed"
                        )}>
                            <Button
                                onClick={handleEmailClick}
                                className={cn("w-full")}
                                variant="outline"
                                disabled={!order.customer_email}
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Enviar Email (Próximamente)
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <h4 className="font-medium">Mapa de Entrega</h4>
                    <div className="border rounded-lg p-4 bg-muted/50">
                        <div className="aspect-video bg-muted rounded flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <MapPin className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">Integración con Google Maps</p>
                                <p className="text-xs">Próximamente</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(order.created_by_employee || order.updated_by_employee) && (
                <div className="space-y-3">
                    <h4 className="font-medium">Gestión de Pedidos</h4>
                    {order.created_by_employee && (
                        <div className="text-sm">
                            <span className="text-muted-foreground">Creado por: </span>
                            <span className="font-medium">
                                {order.created_by_employee.user?.first_name
                                    ? `${order.created_by_employee.user.first_name} ${order.created_by_employee.user.last_name || ''}`
                                    : order.created_by_employee.user?.email
                                }
                            </span>
                        </div>
                    )}
                    {order.updated_by_employee && (
                        <div className="text-sm">
                            <span className="text-muted-foreground">Última actualización por: </span>
                            <span className="font-medium">
                                {order.updated_by_employee.user?.first_name
                                    ? `${order.updated_by_employee.user.first_name} ${order.updated_by_employee.user.last_name || ''}`
                                    : order.updated_by_employee.user?.email
                                }
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export { CustomerInfoStep }