"use client"

import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { confirmOrderAction } from "@/features/orders/actions/confirm-order.action"
import { OrderStatusStepProps } from "@/features/orders/types"
import { Alert, AlertDescription } from "@/features/shadcn/components/ui/alert"
import { Button } from "@/features/shadcn/components/ui/button"
import { cn } from "@/lib/utils"

function OrderStatusStep({ order, employeePermissions }: OrderStatusStepProps) {
    const [isPending, startTransition] = useTransition()

    // Check if user can update orders
    const canUpdateOrders = employeePermissions.isAdmin || employeePermissions.permissions?.can_update_orders

    const handleConfirmOrder = () => {
        startTransition(async () => {
            try {
                const result = await confirmOrderAction({
                    orderId: order.id.toString()
                })

                if (result.hasError) {
                    toast.error(result.message)
                } else {
                    toast.success("Pedido confirmado con éxito! El cliente ha sido notificado.")
                    window.location.reload()
                }
            } catch (error) {
                console.error("Error confirming order:", error)
                toast.error("Error al confirmar el pedido")
            }
        })
    }

    const isOrderReady = order.status === "READY"
    const isOrderCompleted = order.status === "COMPLETED"

    return (
        <div className="grow flex flex-col justify-center">
            <h3 className="text-lg font-semibold mb-2">Confirmar Pedido</h3>
            <p className="text-sm text-muted-foreground mb-4">
                Revisá toda la información del pedido antes de confirmar
            </p>
            {isOrderReady && (
                <p className=" text-green-600 font-medium text-center mb-4">
                    ✓ Este pedido ya fue confirmado y el cliente ya fue notificado
                </p>
            )}
            <div className={cn("bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6", isOrderReady || isOrderCompleted && "opacity-30")}>
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-2">Información Importante:</p>
                        <ul className="space-y-1 text-blue-700">
                            <li>• Por favor revisá todos los detalles del pedido cuidadosamente antes de confirmar</li>
                            <li>• Una vez confirmado, el cliente será notificado que su pedido está listo</li>
                            <li>• Para <strong>pedidos para recoger</strong>: El cliente será informado que su pedido está listo para recoger</li>
                            <li>• Para <strong>pedidos para entrega</strong>: El cliente será informado que su pedido está listo para entrega</li>
                            <li>• Cualquier cambio en el pedido aún puede realizarse después de la confirmación</li>
                            <li>• El seguimiento del pedido se creará automáticamente para las actualizaciones del cliente</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                {canUpdateOrders ? (
                    <Button
                        onClick={handleConfirmOrder}
                        disabled={isPending || isOrderReady || isOrderCompleted}
                        size="lg"
                        className="min-w-[200px]"
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {isPending ? "Confirming..." : isOrderReady ? "Order Already Confirmed" : "Confirm Order"}
                    </Button>
                ) : (
                    <Alert className="w-full max-w-md">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            No tenés permisos suficientes para cambiar el estado de este pedido. Por favor contactá a un administrador.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}

export { OrderStatusStep }