import { getOrderDetails } from "@/features/stores/actions/getOrderDetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderDetailPageProps } from "@/features/stores/types/order-detail-page-type"
import { ArrowLeft/* , User, Package, Mail, Phone  */} from "lucide-react"
import Link from "next/link"
/* import { Badge } from "@/components/ui/badge" */
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
/* import { cn } from "@/lib/utils"
import { OrderItem, Product, Category } from "@prisma/client" */
import { getTranslations } from "next-intl/server"
import OrderChat from "@/features/orders/components/order-chat"
import OrderSummarySteps from "@/features/orders/components/order-summary-steps"

/* type OrderItemWithProduct = OrderItem & {
    product: Product & {
        categories: Category[]
    }
} */

async function OrderDetailPage({ params }: OrderDetailPageProps) {

    const { slug, id } = await params

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: order, error } = await getOrderDetails(id)

    if (error || !order) {
        return console.log(error)
    }

    /* const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } */

   /*  const formatCurrency = (amount: number) => {
        return Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount)
    } */

    const t = await getTranslations("store")

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link href={`/stores/${slug}/orders`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                    {t("orders.order-details")}#{order.id}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex grow gap-4">
                <Card className="w-full">
                    <CardContent className="flex flex-col gap-4 grow">
                        <OrderSummarySteps 
                            order={order}
                        />
                    </CardContent>
                </Card>
                <OrderChat storeSlug={slug} orderId={id} />
            </CardContent>
        </Card>
    )
}

export default OrderDetailPage 