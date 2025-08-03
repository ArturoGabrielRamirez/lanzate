import { getOrderDetails } from "@/features/stores/actions/getOrderDetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderDetailPageProps } from "@/features/stores/types/order-detail-page-type"
import { ArrowLeft, User, Package, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { cn } from "@/lib/utils"
import { OrderItem, Product, Category } from "@prisma/client"
import { getTranslations } from "next-intl/server"
import OrderChat from "@/features/orders/components/order-chat"
import OrderSummarySteps from "@/features/orders/components/order-summary-steps"

type OrderItemWithProduct = OrderItem & {
    product: Product & {
        categories: Category[]
    }
}

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

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatCurrency = (amount: number) => {
        return Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount)
    }

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
                        <OrderSummarySteps />
                        {/* <div className="flex items-center gap-2 justify-between">
                            <p className="text-sm">{formatDate(order.created_at)}</p>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-sm uppercase border-2">
                                    {order.shipping_method === "pickup" ? t("branches.store-pickup") : t("branches.delivery")}
                                </Badge>
                                <Badge
                                    className={cn(
                                        "bg-transparent text-sm",
                                        order.status === "PENDING" && "border-yellow-500 text-yellow-500",
                                        order.status === "PROCESSING" && "border-orange-500 text-orange-500",
                                        order.status === "READY" && "border-blue-500 text-blue-500",
                                        order.status === "SHIPPED" && "border-violet-500 text-violet-500",
                                        order.status === "DELIVERED" && "border-green-500 text-green-500",
                                        order.status === "CANCELLED" && "border-red-500 text-red-500",
                                    )}
                                >
                                    {order.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="grow">
                            <h3 className="flex items-center gap-2 font-semibold text-lg">
                                <User className="size-4" />
                                {order.customer_name || 'No name provided'}
                            </h3>
                            <p className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="size-4" />
                                {order.customer_email || "No email provided"}
                            </p>
                            <p className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="size-4" />
                                {order.customer_phone || "No phone provided"}
                            </p>

                        </div> */}
                        {/* <p className="text-lg font-bold">{formatCurrency(order.total_price)}</p>
                        <p className="text-xs text-muted-foreground">{order.total_quantity} {order.total_quantity === 1 ? t("orders.item") : t("orders.items")}</p> */}

                        {/* {order.branch && (
                            <div className="">
                                <p className="text-sm font-medium">{order.branch.name}</p>
                                <p className="text-xs text-muted-foreground">{order.branch.address}</p>
                            </div>
                        )}
                        {order.items.map((item: OrderItemWithProduct) => (
                            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-md bg-secondary">
                                        {item.product.image ? (
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <Package className="w-6 h-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{item.product.name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {t("orders.quantity")}{item.quantity} × {formatCurrency(item.price)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
                                </div>
                            </div>
                        ))}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">{t("orders.amount")}</p>
                                <p className="font-medium">{formatCurrency(order.payment.amount)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t("orders.status")}</p>
                                <Badge variant={order.payment.status === "PAID" ? "default" : "secondary"}>
                                    {order.payment.status}
                                </Badge>
                            </div>
                        </div>
                        {order.created_by_employee && (
                            <div>
                                <p className="text-sm text-muted-foreground">{t("orders.created-by")}</p>
                                <p className="font-medium">
                                    {order.created_by_employee.user?.first_name
                                        ? `${order.created_by_employee.user.first_name} ${order.created_by_employee.user.last_name || ''}`
                                        : order.created_by_employee.user?.email
                                    }
                                </p>
                            </div>
                        )}
                        {order.updated_by_employee && (
                            <div>
                                <p className="text-sm text-muted-foreground">{t("orders.last-updated-by")}</p>
                                <p className="font-medium">
                                    {order.updated_by_employee.user?.first_name
                                        ? `${order.updated_by_employee.user.first_name} ${order.updated_by_employee.user.last_name || ''}`
                                        : order.updated_by_employee.user?.email
                                    }
                                </p>
                            </div>
                        )} */}
                    </CardContent>
                </Card>
                <OrderChat storeSlug={slug} orderId={id} />
            </CardContent>
        </Card>
    )
}

export default OrderDetailPage 