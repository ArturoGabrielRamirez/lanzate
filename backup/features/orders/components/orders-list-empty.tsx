import { ShoppingCart } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty";
import { Card, CardContent } from "@/features/shadcn/components/ui/card";

function OrdersListEmpty() {
    return (
        <Card>
            <CardContent>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ShoppingCart />
                        </EmptyMedia>
                        <EmptyTitle>Pedidos no encontrados</EmptyTitle>
                        <EmptyDescription>
                            <p>No se encontraron pedidos</p>
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </CardContent>
        </Card>
    )
}

export { OrdersListEmpty }