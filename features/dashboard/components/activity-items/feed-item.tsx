import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Contract, ContractAssignment, Order, OrderTracking, Product, SocialActivity, Store, User } from "@prisma/client"
import { extractLink, formatActivityDate, getUserInitials } from "./shared-utils"
import { FileCheck, Flame, MapPin, MessageCircle, ShoppingBag, Truck } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import ConfirmOrderButton from "@/features/orders/components/confirm-order-button"
import { Badge } from "@/components/ui/badge"

type Props = {
    item: SocialActivity & { user: User, store: Store, product: Product, order: Order & { tracking: OrderTracking }, contract: ContractAssignment & { contract: Contract } }
}
const FeedItem = ({ item }: Props) => {

    return (
        <Card className="h-full group not-dark:bg-gradient-to-br not-dark:to-background not-dark:from-transparent not-dark:to-120% border-white/5 backdrop-blur-sm hover:!shadow-2xl dark:via-background hover:border-white/40 relative dark:hover:to-primary/20 dark:bg-card group">
            <CardHeader className="flex gap-2">
                <Avatar className="h-10 w-10">
                    <AvatarImage
                        src={item.user?.avatar || undefined}
                        alt={`${item.user?.first_name} ${item.user?.last_name}`}
                    />
                    <AvatarFallback>
                        {getUserInitials(item.user?.email || '')}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="flex items-start gap-2">
                        <p className="font-medium text-primary">
                            @{item.user?.username}
                        </p>
                    </CardTitle>
                    <CardDescription>
                        {formatActivityDate(item.created_at)}
                    </CardDescription>
                </div>
                <div className="ml-auto text-muted group-hover:text-primary transition-colors">
                    <Tooltip>
                        <TooltipTrigger>
                            {item.activity_type === "PRODUCT_LIKE" && <Flame />}
                            {item.activity_type === "PRODUCT_COMMENT" && <MessageCircle />}
                            {item.activity_type === "ORDER_CREATED" && <ShoppingBag />}
                            {item.activity_type === "CONTRACT_ASSIGNED" && <FileCheck />}
                        </TooltipTrigger>
                        <TooltipContent>
                            {item.activity_type === "PRODUCT_LIKE" && "Me gusta"}
                            {item.activity_type === "PRODUCT_COMMENT" && "Comentario"}
                            {item.activity_type === "ORDER_CREATED" && "Orden creada"}
                            {item.activity_type === "CONTRACT_ASSIGNED" && "Contrato asignado"}
                        </TooltipContent>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                        {item.activity_type === "PRODUCT_LIKE" && "Le dio me gusta a"}
                        {item.activity_type === "PRODUCT_COMMENT" && "Comentó en"}
                        {item.activity_type === "ORDER_CREATED" && "Creó una orden"}
                        {item.activity_type === "CONTRACT_ASSIGNED" && "Asignó un contrato"}
                    </span>
                    <Link href={extractLink(item) || ''} className="font-medium text-primary">
                        {item.activity_type === "PRODUCT_LIKE" && `@${item.product.name}`}
                        {item.activity_type === "PRODUCT_COMMENT" && `@${item.product.name}`}
                        {item.activity_type === "ORDER_CREATED" && `#${item.order.id}`}
                        {item.activity_type === "CONTRACT_ASSIGNED" && `@${item.contract.contract.title}`}
                    </Link>
                    {item.activity_type === "ORDER_CREATED" && (
                        <Tooltip>
                            <TooltipTrigger>

                                <Badge variant="outline">
                                    {item.order.status}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                {item.order.status === "PROCESSING" && "Orden en proceso"}
                                {item.order.status === "READY" && "Orden lista para entrega"}
                                {item.order.status === "COMPLETED" && "Orden completada"}
                                {item.order.status === "CANCELLED" && "Orden cancelada"}
                            </TooltipContent>
                        </Tooltip>
                    )}
                    {item.activity_type === "ORDER_CREATED" && (
                        <Tooltip>
                            <TooltipTrigger className="text-muted-foreground group-hover:text-primary transition-colors">
                                {item.order.shipping_method === "DELIVERY" && <Truck />}
                                {item.order.shipping_method === "PICKUP" && <MapPin />}
                            </TooltipTrigger>
                            <TooltipContent>
                                {item.order.shipping_method === "DELIVERY" && "Delivery to customer's address"}
                                {item.order.shipping_method === "PICKUP" && "Pick up at store"}
                            </TooltipContent>
                        </Tooltip>
                    )}
                </p>
            </CardContent>
            <CardFooter className="flex justify-end">
                {item.activity_type === "ORDER_CREATED" && item.order.status === "PROCESSING" && (
                    <ConfirmOrderButton order={item.order} canUpdateOrders />
                )}
            </CardFooter>
        </Card>
    )
}
export default FeedItem