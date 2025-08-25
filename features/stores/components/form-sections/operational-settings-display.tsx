"use client"

import { Store, StoreOperationalSettings } from "@prisma/client"
import { Truck, CreditCard, DollarSign } from "lucide-react"
import { EditOperationalSettingsButton } from "../section-buttons"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OperationalSettingsDisplayProps {
    store: Store & {
        operational_settings: StoreOperationalSettings | null
    }
}

const OperationalSettingsDisplay = ({ store }: OperationalSettingsDisplayProps) => {
    const operationalSettings = store.operational_settings

    const getPaymentMethodLabel = (method: string) => {
        const labels: Record<string, string> = {
            CASH: "Cash",
            CREDIT_CARD: "Credit Card",
            DEBIT_CARD: "Debit Card",
            TRANSFER: "Bank Transfer",
            MERCADO_PAGO: "Mercado Pago",
            PAYPAL: "PayPal",
            CRYPTO: "Cryptocurrency"
        }
        return labels[method] || method
    }

    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return "Not set"
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <span className="flex items-center gap-2">
                        <Truck className="size-4" />
                        Operational Settings
                    </span>
                </CardTitle>
                <CardAction>
                    <EditOperationalSettingsButton
                        storeId={store.id}
                        store={store}
                    />
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Delivery Information */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <Truck className="size-3" />
                            Delivery Service
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="font-medium text-sm text-muted-foreground">Delivery Available</p>
                                <Badge variant={operationalSettings?.offers_delivery ? "default" : "secondary"}>
                                    {operationalSettings?.offers_delivery ? "Yes" : "No"}
                                </Badge>
                            </div>
                            {operationalSettings?.offers_delivery && (
                                <>
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm text-muted-foreground">Delivery Price</p>
                                        <p className="text-base flex items-center gap-1">
                                            {formatCurrency(operationalSettings.delivery_price)}
                                        </p>
                                    </div>
                                    {operationalSettings.free_delivery_minimum && (
                                        <div className="space-y-1">
                                            <p className="font-medium text-sm text-muted-foreground">Free Delivery Minimum</p>
                                            <p className="text-base flex items-center gap-1">
                                                {formatCurrency(operationalSettings.free_delivery_minimum)}
                                            </p>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm text-muted-foreground">Delivery Radius</p>
                                        <p className="text-base">
                                            {operationalSettings.delivery_radius_km || 5} km
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <CreditCard className="size-3" />
                            Payment Methods
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium text-sm text-muted-foreground">Accepted Payment Methods</p>
                                <div className="flex flex-wrap gap-2">
                                    {operationalSettings?.payment_methods && operationalSettings.payment_methods.length > 0 ? (
                                        operationalSettings.payment_methods.map((method) => (
                                            <Badge key={method} variant="outline">
                                                {getPaymentMethodLabel(method)}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No payment methods configured</p>
                                    )}
                                </div>
                            </div>
                            {operationalSettings?.minimum_order_amount && operationalSettings.minimum_order_amount > 0 ? (
                                <div className="space-y-1">
                                    <p className="font-medium text-sm text-muted-foreground">Minimum Order Amount</p>
                                    <p className="text-base flex items-center gap-1">
                                        {formatCurrency(operationalSettings.minimum_order_amount)}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default OperationalSettingsDisplay
