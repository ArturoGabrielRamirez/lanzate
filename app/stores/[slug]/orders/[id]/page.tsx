import { getOrderDetails } from "@/features/stores/actions/getOrderDetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderDetailPageProps } from "@/features/stores/types/order-detail-page-type"
import { ArrowLeft, User, MapPin, Truck, Calendar, DollarSign, Package, CreditCard, UserCheck, Clock } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { cn } from "@/lib/utils"
import { OrderItem, Product, Category } from "@/prisma/generated/prisma"
import { getTranslations } from "next-intl/server"

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

    const t = await getTranslations("store.orders")

    const formatCurrency = (amount: number) => {
        return Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link href={`/stores/${slug}/orders`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                    {t("order-details")}#{order.id}
                </CardTitle>
            </CardHeader>
            <CardContent className="grow flex">
                <div className="grid grid-cols-1 gap-6 w-full">

                    {/* Order Status and Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    {t("status")}
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
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {t("date-created")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{formatDate(order.created_at)}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    {t("total")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-bold">{formatCurrency(order.total_price)}</p>
                                <p className="text-xs text-muted-foreground">{order.total_quantity} {order.total_quantity === 1 ? t("item") : t("items")}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {t("customer-information")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 overflow-hidden rounded-full bg-secondary flex items-center justify-center">
                                    {order.user.avatar ? (
                                        <img
                                            src={order.user.avatar}
                                            alt={`${order.user.first_name || 'Customer'} avatar`}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <img
                                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${order.user.first_name || 'Customer'} ${order.user.last_name || ''}`}
                                            alt="Customer Avatar"
                                            className="object-cover w-full h-full"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold">
                                        {order.user.first_name ? `${order.user.first_name} ${order.user.last_name || ''}` : order.user.email}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{order.user.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {order.shipping_method === "pickup" ? <MapPin className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                                {t("shipping-method")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                    {order.shipping_method === "pickup" ? t("store-pickup") : t("delivery")}
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

                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                {t("order-items")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item: OrderItemWithProduct) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center overflow-hidden">
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
                                                    {t("quantity")}{item.quantity} × {formatCurrency(item.price)}
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

                    {/* Payment Information */}
                    {order.payment && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    {t("payment-information")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t("amount")}</p>
                                        <p className="font-medium">{formatCurrency(order.payment.amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t("status")}</p>
                                        <Badge variant={order.payment.status === "PAID" ? "default" : "secondary"}>
                                            {order.payment.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Employee Information */}
                    {(order.created_by_employee || order.updated_by_employee) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCheck className="w-4 h-4" />
                                    {t("employee-information")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {order.created_by_employee && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t("created-by")}</p>
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
                                            <p className="text-sm text-muted-foreground">{t("last-updated-by")}</p>
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

                </div>
            </CardContent>
        </Card>
    )
}

export default OrderDetailPage 