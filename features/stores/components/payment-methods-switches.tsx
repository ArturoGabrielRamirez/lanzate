"use client"

import { PaymentMethod } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PaymentMethodsSwitchesProps } from "@/features/stores/types"

function PaymentMethodsSwitches({ defaultMethods = [PaymentMethod.CASH], onPaymentMethodsChange }: PaymentMethodsSwitchesProps) {
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<PaymentMethod[]>(defaultMethods)
    const { setValue } = useFormContext()
    const t = useTranslations("store.edit-operational-settings")

    useEffect(() => {
        // Set initial value in form context
        setValue("payment_methods", selectedPaymentMethods)
    }, [setValue, selectedPaymentMethods])

    const handleMethodChange = (method: PaymentMethod, checked: boolean) => {
        let newMethods: PaymentMethod[]
        
        if (checked) {
            newMethods = [...selectedPaymentMethods, method]
        } else {
            newMethods = selectedPaymentMethods.filter(m => m !== method)
        }
        
        setSelectedPaymentMethods(newMethods)
        setValue("payment_methods", newMethods)
        onPaymentMethodsChange?.(newMethods)
    }

    const paymentMethodLabels: Record<PaymentMethod, string> = {
        CASH: 'Efectivo',
        CREDIT_CARD: 'Tarjeta de Crédito',
        DEBIT_CARD: 'Tarjeta de Débito',
        TRANSFER: 'Transferencia',
        MERCADO_PAGO: 'Mercado Pago',
        PAYPAL: 'PayPal',
        CRYPTO: 'Criptomonedas'
    }

    return (
        <div className="space-y-3">
            <Label>{t("payment-methods")}</Label>
            <div className="space-y-3">
                {Object.values(PaymentMethod).map((method) => (
                    <div key={method} className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor={`payment-${method}`} className="text-sm font-medium">
                                {paymentMethodLabels[method]}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                {method === PaymentMethod.CASH && "Pagos en efectivo"}
                                {method === PaymentMethod.CREDIT_CARD && "Tarjetas de crédito"}
                                {method === PaymentMethod.DEBIT_CARD && "Tarjetas de débito"}
                                {method === PaymentMethod.TRANSFER && "Transferencias bancarias"}
                                {method === PaymentMethod.MERCADO_PAGO && "Pagos con Mercado Pago"}
                                {method === PaymentMethod.PAYPAL && "Pagos con PayPal"}
                                {method === PaymentMethod.CRYPTO && "Criptomonedas"}
                            </p>
                        </div>
                        <Switch
                            id={`payment-${method}`}
                            checked={selectedPaymentMethods.includes(method)}
                            onCheckedChange={(checked) => handleMethodChange(method, checked)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
} 

export { PaymentMethodsSwitches }