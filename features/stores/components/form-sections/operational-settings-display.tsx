"use client"

import { Store, StoreOperationalSettings, PaymentMethod, Branch, BranchOperationalSettings, BranchShippingMethod } from "@prisma/client"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface OperationalSettingsDisplayProps {
    store: Store & {
        operational_settings: StoreOperationalSettings | null
        branches?: (Branch & {
            operational_settings: BranchOperationalSettings | null
            shipping_methods: BranchShippingMethod[]
        })[]
    }
}

const OperationalSettingsDisplay = ({ store }: OperationalSettingsDisplayProps) => {
    const storeOperationalSettings = store.operational_settings

    const mainBranch = store.branches?.find(b => b.is_main)
    /* mainBranch?.shipping_methods */
    const branchOperationalSettings = mainBranch?.operational_settings || null

    const effectiveOffersDelivery = Boolean(branchOperationalSettings?.offers_delivery ?? storeOperationalSettings?.offers_delivery)
    const effectivePaymentMethods = branchOperationalSettings?.payment_methods ?? storeOperationalSettings?.payment_methods ?? []

    const [isEditing, setIsEditing] = useState(false)
    const [offersDelivery, setOffersDelivery] = useState(effectiveOffersDelivery)

    useEffect(() => {
        setOffersDelivery(effectiveOffersDelivery)
    }, [effectiveOffersDelivery])

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
            offers_delivery: Boolean(effectiveOffersDelivery),
            // The following remain store-level while we migrate UI to per-method settings
            delivery_price: storeOperationalSettings?.delivery_price?.toString() || "0",
            free_delivery_minimum: storeOperationalSettings?.free_delivery_minimum?.toString() || "",
            delivery_radius_km: storeOperationalSettings?.delivery_radius_km?.toString() || "5",
            minimum_order_amount: branchOperationalSettings?.minimum_order_amount?.toString() || storeOperationalSettings?.minimum_order_amount?.toString() || "0",
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
            <Tooltip>
                <TooltipTrigger asChild>
                    <IconButton
                        icon={isEditing ? X : EditIcon}
                        onClick={onClick}
                        className="opacity-0 group-hover/operational-settings-display:opacity-100 transition-opacity duration-300"
                    />
                </TooltipTrigger>
                <TooltipContent>
                    Editar información de operacionales
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <Card className="group/operational-settings-display">
            <Form submitButton={false} contentButton={false} resolver={yupResolver(editOperationalSettingsSchema as never)}>
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
                                        defaultValue={effectiveOffersDelivery}
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
                                                defaultValue={storeOperationalSettings?.delivery_price?.toString() || "0"}
                                                disabled={!isEditing || !offersDelivery}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <InputField
                                                name="free_delivery_minimum"
                                                label="Free Delivery Minimum"
                                                type="number"
                                                defaultValue={storeOperationalSettings?.free_delivery_minimum?.toString() || "0"}
                                                disabled={!isEditing || !offersDelivery}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <InputField
                                                name="delivery_radius_km"
                                                label="Delivery Radius (km)"
                                                type="number"
                                                defaultValue={storeOperationalSettings?.delivery_radius_km?.toString() || "5"}
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
                                            defaultMethods={effectivePaymentMethods as PaymentMethod[]}
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {effectivePaymentMethods && effectivePaymentMethods.length > 0 ? (
                                                effectivePaymentMethods.map((method) => (
                                                    <Badge key={method} variant="outline">
                                                        {getPaymentMethodLabel(String(method))}
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
                                        defaultValue={branchOperationalSettings?.minimum_order_amount?.toString() || storeOperationalSettings?.minimum_order_amount?.toString() || "0"}
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
