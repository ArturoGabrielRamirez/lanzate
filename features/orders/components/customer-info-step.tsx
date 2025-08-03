"use client"

import { Button } from "@/components/ui/button"
import { User, Mail, Phone, MapPin, MessageCircle } from "lucide-react"

type Order = {
    id: number
    shipping_method: "PICKUP" | "DELIVERY"
    customer_name: string | null
    customer_email: string | null
    customer_phone: string | null
    address_one?: string | null
    address_two?: string | null
    city?: string | null
    state?: string | null
    zip_code?: string | null
    country?: string | null
    branch?: {
        name: string
        address: string
    } | null
    created_by_employee?: {
        user?: {
            first_name: string | null
            last_name: string | null
            email: string
        }
    } | null
    updated_by_employee?: {
        user?: {
            first_name: string | null
            last_name: string | null
            email: string
        }
    } | null
}

type Props = {
    order: Order
}

function CustomerInfoStep({ order }: Props) {
    const isPickup = order.shipping_method === "PICKUP"

    const handleWhatsAppClick = () => {
        if (order.customer_phone) {
            const phoneNumber = order.customer_phone.replace(/\D/g, '')
            const message = `Hi ${order.customer_name || 'there'}! Your order #${order.id} is ready for pickup.`
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
            window.open(whatsappUrl, '_blank')
        }
    }

    const handleEmailClick = () => {
        // TODO: Implement email functionality
        console.log("Email functionality to be implemented")
    }

    const formatAddress = () => {
        const parts = [
            order.address_one,
            order.address_two,
            order.city,
            order.state,
            order.zip_code,
            order.country
        ].filter(Boolean)
        
        return parts.join(', ')
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        <span className="font-medium">{order.customer_name || 'No name provided'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Mail className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{order.customer_email || "No email provided"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Phone className="size-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{order.customer_phone || "No phone provided"}</span>
                    </div>

                    {!isPickup && order.address_one && (
                        <div className="flex items-start gap-2">
                            <MapPin className="size-4 text-muted-foreground mt-0.5" />
                            <div className="text-muted-foreground">
                                <p className="font-medium">Delivery Address:</p>
                                <p>{formatAddress()}</p>
                            </div>
                        </div>
                    )}

                    {isPickup && order.branch && (
                        <div className="flex items-start gap-2">
                            <MapPin className="size-4 text-muted-foreground mt-0.5" />
                            <div className="text-muted-foreground">
                                <p className="font-medium">Pickup Location:</p>
                                <p>{order.branch.name}</p>
                                <p>{order.branch.address}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isPickup ? (
                <div className="space-y-3">
                    <h4 className="font-medium">Contact Customer</h4>
                    <div className="space-y-2">
                        {order.customer_phone && (
                            <Button 
                                onClick={handleWhatsAppClick}
                                className="w-full"
                                variant="outline"
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Send WhatsApp Message
                            </Button>
                        )}
                        {order.customer_email && (
                            <Button 
                                onClick={handleEmailClick}
                                className="w-full"
                                variant="outline"
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email (Coming Soon)
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <h4 className="font-medium">Delivery Map</h4>
                    <div className="border rounded-lg p-4 bg-muted/50">
                        <div className="aspect-video bg-muted rounded flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                                <MapPin className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm">Google Maps Integration</p>
                                <p className="text-xs">Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(order.created_by_employee || order.updated_by_employee) && (
                <div className="space-y-3">
                    <h4 className="font-medium">Order Management</h4>
                    {order.created_by_employee && (
                        <div className="text-sm">
                            <span className="text-muted-foreground">Created by: </span>
                            <span className="font-medium">
                                {order.created_by_employee.user?.first_name
                                    ? `${order.created_by_employee.user.first_name} ${order.created_by_employee.user.last_name || ''}`
                                    : order.created_by_employee.user?.email
                                }
                            </span>
                        </div>
                    )}
                    {order.updated_by_employee && (
                        <div className="text-sm">
                            <span className="text-muted-foreground">Last updated by: </span>
                            <span className="font-medium">
                                {order.updated_by_employee.user?.first_name
                                    ? `${order.updated_by_employee.user.first_name} ${order.updated_by_employee.user.last_name || ''}`
                                    : order.updated_by_employee.user?.email
                                }
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CustomerInfoStep 