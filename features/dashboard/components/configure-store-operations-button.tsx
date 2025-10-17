"use client"

import { PaymentMethod } from "@prisma/client"
import { Settings, Clock, CreditCard, Truck } from "lucide-react"
import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateStoreOperationalSettingsAction } from "@/features/dashboard/actions/updateStoreOperationalSettingsAction"
import { operationalSettingsSchema } from "@/features/dashboard/schemas/operational-settings-schema"
import { StoreOperationalSettingsForm, ConfigureStoreOperationsButtonProps } from "@/features/dashboard/types"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { formatErrorResponse } from "@/utils/lib"

function ConfigureStoreOperationsButton({ stores }: ConfigureStoreOperationsButtonProps) {
    const [selectedStoreId, setSelectedStoreId] = useState<string>("")
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(["CASH"])

    const handleConfigureOperations = async (formData: StoreOperationalSettingsForm) => {
        try {
            if (!selectedStoreId) {
                throw new Error("Please select a store first")
            }

            const settingsWithPaymentMethods = {
                ...formData,
                payment_methods: paymentMethods
            }

            const result = await updateStoreOperationalSettingsAction(
                parseInt(selectedStoreId), 
                settingsWithPaymentMethods
            )
            
            if (result.error) {
                throw new Error(result.message)
            }

            // Reset selection after successful save
            setSelectedStoreId("")
            setPaymentMethods(["CASH"])
            
            return result
        } catch (error) {
            return formatErrorResponse("Error configuring store operations", error, formData)
        }
    }

    const selectedStore = stores.find(store => store.id.toString() === selectedStoreId)

    const paymentMethodOptions = [
        { value: 'CASH', label: 'Cash' },
        { value: 'CREDIT_CARD', label: 'Credit Card' },
        { value: 'DEBIT_CARD', label: 'Debit Card' },
        { value: 'TRANSFER', label: 'Bank Transfer' },
        { value: 'MERCADO_PAGO', label: 'Mercado Pago' },
        { value: 'PAYPAL', label: 'PayPal' },
        { value: 'CRYPTO', label: 'Cryptocurrency' }
    ]

    return (
        <ButtonWithPopup
            schema={operationalSettingsSchema}
            action={handleConfigureOperations}
            text={(
                <>
                    <Settings className="size-4" />
                    Configure Operations
                </>
            )}
            title="Configure Store Operations"
            description="Set up delivery, business hours, and payment methods for your store."
            messages={{
                success: "Store operations configured successfully!",
                error: "Failed to configure store operations",
                loading: "Configuring operations..."
            }}
            className="w-full"
        >
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Store Selection */}
                <div className="space-y-2">
                    <Label htmlFor="store-select">Select Store</Label>
                    <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a store..." />
                        </SelectTrigger>
                        <SelectContent>
                            {stores.map((store) => (
                                <SelectItem key={store.id} value={store.id.toString()}>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{store.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {store.subdomain}.lanzate.co
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedStore && (
                        <p className="text-xs text-muted-foreground">
                            Configuring operations for: <span className="font-medium">{selectedStore.name}</span>
                        </p>
                    )}
                </div>

                {selectedStore && (
                    <>
                        {/* Delivery Configuration */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Truck className="size-4" />
                                    Delivery Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InputField 
                                    name="offers_delivery" 
                                    label="Offer Delivery Service" 
                                    type="checkbox" 
                                />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField 
                                        name="delivery_price" 
                                        label="Delivery Price ($)" 
                                        type="number" 
                                        defaultValue="0"
                                    />
                                    <InputField 
                                        name="free_delivery_minimum" 
                                        label="Free Delivery Minimum ($)" 
                                        type="number" 
                                        defaultValue="0"
                                    />
                                    <InputField 
                                        name="delivery_time_min" 
                                        label="Delivery Time Min (minutes)" 
                                        type="number" 
                                        defaultValue="30"
                                    />
                                    <InputField 
                                        name="delivery_time_max" 
                                        label="Delivery Time Max (minutes)" 
                                        type="number" 
                                        defaultValue="60"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Hours */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Clock className="size-4" />
                                    Business Hours
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField name="monday_open" label="Monday Open" type="time" defaultValue="09:00" />
                                    <InputField name="monday_close" label="Monday Close" type="time" defaultValue="18:00" />
                                    <InputField name="tuesday_open" label="Tuesday Open" type="time" defaultValue="09:00" />
                                    <InputField name="tuesday_close" label="Tuesday Close" type="time" defaultValue="18:00" />
                                    <InputField name="wednesday_open" label="Wednesday Open" type="time" defaultValue="09:00" />
                                    <InputField name="wednesday_close" label="Wednesday Close" type="time" defaultValue="18:00" />
                                    <InputField name="thursday_open" label="Thursday Open" type="time" defaultValue="09:00" />
                                    <InputField name="thursday_close" label="Thursday Close" type="time" defaultValue="18:00" />
                                    <InputField name="friday_open" label="Friday Open" type="time" defaultValue="09:00" />
                                    <InputField name="friday_close" label="Friday Close" type="time" defaultValue="18:00" />
                                    <InputField name="saturday_open" label="Saturday Open" type="time" defaultValue="10:00" />
                                    <InputField name="saturday_close" label="Saturday Close" type="time" defaultValue="16:00" />
                                    <InputField name="sunday_open" label="Sunday Open" type="time" defaultValue="" />
                                    <InputField name="sunday_close" label="Sunday Close" type="time" defaultValue="" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pickup Times */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Clock className="size-4" />
                                    Pickup Times
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField 
                                        name="pickup_time_min" 
                                        label="Pickup Time Min (minutes)" 
                                        type="number" 
                                        defaultValue="15"
                                    />
                                    <InputField 
                                        name="pickup_time_max" 
                                        label="Pickup Time Max (minutes)" 
                                        type="number" 
                                        defaultValue="30"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CreditCard className="size-4" />
                                    Payment Methods
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3">
                                    {paymentMethodOptions.map((method) => (
                                        <div key={method.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={method.value}
                                                checked={paymentMethods.includes(method.value as PaymentMethod)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setPaymentMethods(prev => [...prev, method.value as PaymentMethod])
                                                    } else {
                                                        setPaymentMethods(prev => prev.filter(m => m !== method.value))
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={method.value} className="text-sm">
                                                {method.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {paymentMethods.length === 0 && (
                                    <p className="text-sm text-red-500 mt-2">At least one payment method is required</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Additional Settings */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Additional Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InputField 
                                    name="requires_phone_for_delivery" 
                                    label="Require Phone for Delivery" 
                                    type="checkbox" 
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField 
                                        name="minimum_order_amount" 
                                        label="Minimum Order Amount ($)" 
                                        type="number" 
                                        defaultValue="0"
                                    />
                                    <InputField 
                                        name="preparation_time_buffer" 
                                        label="Preparation Buffer (minutes)" 
                                        type="number" 
                                        defaultValue="10"
                                    />
                                </div>
                                <InputField 
                                    name="is_temporarily_closed" 
                                    label="Temporarily Closed" 
                                    type="checkbox" 
                                />
                                <InputField 
                                    name="temporary_closure_reason" 
                                    label="Closure Reason (if temporarily closed)" 
                                    type="text" 
                                />
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </ButtonWithPopup>
    )
}

export default ConfigureStoreOperationsButton 