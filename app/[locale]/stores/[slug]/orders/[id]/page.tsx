import { getOrderDetails } from "@/features/stores/actions/getOrderDetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderDetailPageProps } from "@/features/stores/types/order-detail-page-type"
import { ArrowLeft, User, MapPin, Truck, Calendar, DollarSign, Package, CreditCard, UserCheck } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { cn } from "@/lib/utils"
import { OrderItem, Product, Category } from "@prisma/client"
import { getTranslations } from "next-intl/server"
import HorizontalPanels from "@/features/orders/components/horizontal-panels"
import OrderChat from "@/features/orders/components/order-chat"

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
            <CardContent className="flex grow">
                <OrderChat storeSlug={slug} orderId={id} />
                {/* <HorizontalPanels
                    leftPanel={<p>left</p>}
                    rightPanel={<p>right</p>}
                /> */}
                {/* <div className="grid w-full grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Package className="w-4 h-4" />
                                    {t("orders.status")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    {t("orders.date-created")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{formatDate(order.created_at)}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <DollarSign className="w-4 h-4" />
                                    {t("orders.total")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-bold">{formatCurrency(order.total_price)}</p>
                                <p className="text-xs text-muted-foreground">{order.total_quantity} {order.total_quantity === 1 ? t("orders.item") : t("orders.items")}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {t("orders.customer-information")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="font-semibold">
                                        {order.customer_name || 'No name provided'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {order.customer_email || "No email provided"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.customer_phone || "No phone provided"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {order.shipping_method === "pickup" ? <MapPin className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                                {t("orders.shipping-method")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                    {order.shipping_method === "pickup" ? t("branches.store-pickup") : t("branches.delivery")}
                                </Badge>
                                {order.branch && (
                                    <div className="ml-4">
                                        <p className="text-sm font-medium">{order.branch.name}</p>
                                        <p className="text-xs text-muted-foreground">{order.branch.address}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                {t("orders.order-items")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
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
                            </div>
                        </CardContent>
                    </Card>
                    {order.payment && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    {t("orders.payment-information")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    )}
                    {(order.created_by_employee || order.updated_by_employee) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCheck className="w-4 h-4" />
                                    {t("orders.employee-information")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div> */}
            </CardContent>
        </Card>
    )
}

export default OrderDetailPage 