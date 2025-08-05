import OrderDetailsContainer from "@/features/store-orders/components/order-details-container"

type Props = {
    params: {
        id: string
    }
}

export default function OrderDetailsPage({ params }: Props) {
    return <OrderDetailsContainer orderId={params.id} />
}
