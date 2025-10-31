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
                        <EmptyTitle>No orders found</EmptyTitle>
                        <EmptyDescription>
                            <p>No orders found</p>
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </CardContent>
        </Card>
    )
}

export { OrdersListEmpty }