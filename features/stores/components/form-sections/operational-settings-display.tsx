"use client"

import { Store, StoreOperationalSettings, PaymentMethod } from "@prisma/client"
import { Truck, CreditCard, Edit as EditIcon, X } from "lucide-react"
import { EditOperationalSettingsButton } from "../section-buttons"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Form, InputField, CheckboxField } from "@/features/layout/components"
import { useEffect, useState } from "react"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { PaymentMethodsSwitches } from "../payment-methods-switches"
import { useFormContext } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { editOperationalSettingsSchema, type EditOperationalSettingsData } from "../../schemas/operational-settings-schema"

interface OperationalSettingsDisplayProps {
    store: Store & {
        operational_settings: StoreOperationalSettings | null
    }
}

const OperationalSettingsDisplay = ({ store }: OperationalSettingsDisplayProps) => {
    const operationalSettings = store.operational_settings
    const [isEditing, setIsEditing] = useState(false)
    const [offersDelivery, setOffersDelivery] = useState(operationalSettings?.offers_delivery || false)

    useEffect(() => {
        setOffersDelivery(operationalSettings?.offers_delivery || false)
    }, [operationalSettings?.offers_delivery])

    const handleOpenEdit = () => {
        setIsEditing(true)
    }

    const handleCloseEdit = () => {
        setIsEditing(false)
    }

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

    function ToggleEditButton() {
        const { reset } = useFormContext<EditOperationalSettingsData>()

        const initialValues: EditOperationalSettingsData = {
            offers_delivery: Boolean(operationalSettings?.offers_delivery),
            delivery_price: operationalSettings?.delivery_price?.toString() || "0",
            free_delivery_minimum: operationalSettings?.free_delivery_minimum?.toString() || "",
            delivery_radius_km: operationalSettings?.delivery_radius_km?.toString() || "5",
            minimum_order_amount: operationalSettings?.minimum_order_amount?.toString() || "0",
        }

        const onClick = () => {
            if (isEditing) {
                reset(initialValues)
                setOffersDelivery(initialValues.offers_delivery)
                handleCloseEdit()
                return
            }
            handleOpenEdit()
        }

        return (
            <IconButton icon={isEditing ? X : EditIcon} onClick={onClick} />
        )
    }

    return (
        <Card>
            <Form submitButton={false} contentButton={false} resolver={yupResolver(editOperationalSettingsSchema)}>
                <CardHeader>
                    <CardTitle>
                        <span className="flex items-center gap-2">
                            <Truck className="size-4" />
                            Operational Settings
                        </span>
                    </CardTitle>
                    <CardAction>
                        {isEditing && (
                            <EditOperationalSettingsButton
                                storeId={store.id}
                                store={store}
                                onSuccess={handleCloseEdit}
                            />
                        )}
                        <ToggleEditButton />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                <Truck className="size-3" />
                                Delivery Service
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                    <CheckboxField
                                        name="offers_delivery"
                                        label="Delivery Available"
                                        defaultValue={operationalSettings?.offers_delivery || false}
                                        onChange={(checked) => setOffersDelivery(checked)}
                                        disabled={!isEditing}
                                    />
                                </div>
                                {offersDelivery && (
                                    <>
                                        <div className="space-y-1">
                                            <InputField
                                                name="delivery_price"
                                                label="Delivery Price"
                                                type="number"
                                                defaultValue={operationalSettings?.delivery_price?.toString() || "0"}
                                                disabled={!isEditing || !offersDelivery}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <InputField
                                                name="free_delivery_minimum"
                                                label="Free Delivery Minimum"
                                                type="number"
                                                defaultValue={operationalSettings?.free_delivery_minimum?.toString() || "0"}
                                                disabled={!isEditing || !offersDelivery}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <InputField
                                                name="delivery_radius_km"
                                                label="Delivery Radius (km)"
                                                type="number"
                                                defaultValue={operationalSettings?.delivery_radius_km?.toString() || "5"}
                                                disabled={!isEditing || !offersDelivery}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                <CreditCard className="size-3" />
                                Payment Methods
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    {isEditing ? (
                                        <PaymentMethodsSwitches
                                            defaultMethods={operationalSettings?.payment_methods || [PaymentMethod.CASH]}
                                        />
                                    ) : (
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
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <InputField
                                        name="minimum_order_amount"
                                        label="Minimum Order Amount"
                                        type="number"
                                        defaultValue={operationalSettings?.minimum_order_amount?.toString() || "0"}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Form>
        </Card>
    )
}

export default OperationalSettingsDisplay
