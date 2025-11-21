import { MapPin, Timer } from "lucide-react"

import { OrderDetailsArrivalProps } from "@/features/orders/types"
import { Button } from "@/features/shadcn/components/ui/button"
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from "@/features/shadcn/components/ui/card"

function OrderDetailsArrival({ order }: OrderDetailsArrivalProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <h3 className="text-xl font-medium">
                        Pedido {order.shipping_method === "DELIVERY" ? "Llegada" : "Recogida"}
                    </h3>
                    <Timer />
                </CardTitle>
            </CardHeader>
            <CardContent className="grow">
                <p className="text-muted-foreground">
                    {order.shipping_method === "DELIVERY" ? "Tu pedido llegará a tu dirección en las próximas 24 horas." : "Tu pedido estará listo para recoger en las próximas 24 horas."}
                </p>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button className="w-full md:w-auto">
                    <MapPin className="size-4" />
                    Ver en el mapa
                </Button>
            </CardFooter>
        </Card>
    )
}
export { OrderDetailsArrival }