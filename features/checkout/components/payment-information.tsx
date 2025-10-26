"use client"

import { PaymentMethod } from "@prisma/client"
import { CreditCard, Banknote, Smartphone } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { Card, CardContent } from "@/features/shadcn/components/ui/card"
import { Label } from "@/features/shadcn/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { PaymentInformationProps } from "@/features/checkout/types/types"

function PaymentInformation({ paymentMethod, onChange, allowedPaymentMethods }: PaymentInformationProps) {
    const { setValue } = useFormContext()
    const t = useTranslations("checkout.payment")

    const handlePaymentMethodChange = (value: PaymentMethod) => {
        onChange(value)
        setValue("paymentMethod", value)
    }

    const handleCardFieldChange = (fieldName: string, value: string) => {
        setValue(fieldName, value)
    }

    // Filter payment methods based on what the store allows
    const availablePaymentMethods = [
        { value: "CASH" as PaymentMethod, label: t("method-selector.cash"), icon: Banknote },
        { value: "CREDIT_CARD" as PaymentMethod, label: t("method-selector.credit-debit-card"), icon: CreditCard },
        { value: "DEBIT_CARD" as PaymentMethod, label: t("method-selector.credit-debit-card"), icon: CreditCard },
        { value: "TRANSFER" as PaymentMethod, label: t("method-selector.bank-transfer"), icon: Banknote },
        { value: "MERCADO_PAGO" as PaymentMethod, label: t("method-selector.mercado-pago"), icon: Smartphone },
        { value: "PAYPAL" as PaymentMethod, label: t("method-selector.paypal"), icon: CreditCard },
        { value: "CRYPTO" as PaymentMethod, label: t("method-selector.crypto"), icon: CreditCard },
    ].filter(method => allowedPaymentMethods.includes(method.value))
    
    return (
        <div className="flex flex-col gap-6">
            {/* Payment Method Selection */}
            <div>
                <Label htmlFor="paymentMethod" className="text-base font-medium mb-2 block">
                    {t("method-selector.label")}
                </Label>
                <Select
                    value={paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t("method-selector.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                        {availablePaymentMethods.map((method) => {
                            const IconComponent = method.icon
                            return (
                                <SelectItem key={method.value} value={method.value}>
                                    <div className="flex items-center gap-2">
                                        <IconComponent className="size-4" />
                                        {method.label}
                                    </div>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </div>

            {/* Conditional Payment Fields */}
            {(paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD") && (
                <div className="space-y-4">
                    <Label className="text-base font-medium block">{t("card-info.label")}</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            name="cardNumber"
                            label={t("card-info.card-number")}
                            placeholder={t("card-info.card-number-placeholder")}
                            onChange={(e) => handleCardFieldChange("cardNumber", e.target.value)}
                        />
                        <InputField
                            name="cardHolder"
                            label={t("card-info.cardholder-name")}
                            placeholder={t("card-info.cardholder-placeholder")}
                            onChange={(e) => handleCardFieldChange("cardHolder", e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            name="expiryDate"
                            label={t("card-info.expiry-date")}
                            placeholder={t("card-info.expiry-placeholder")}
                            onChange={(e) => handleCardFieldChange("expiryDate", e.target.value)}
                        />
                        <InputField
                            name="cvv"
                            label={t("card-info.cvv")}
                            placeholder={t("card-info.cvv-placeholder")}
                            onChange={(e) => handleCardFieldChange("cvv", e.target.value)}
                        />
                    </div>
                </div>
            )}

            {paymentMethod === "TRANSFER" && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Banknote className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="space-y-2">
                                <p className="font-medium text-blue-900">{t("bank-transfer.title")}</p>
                                <p className="text-sm text-accent"><strong>{t("bank-transfer.cvu")}</strong></p>
                                <p className="text-sm text-accent"><strong>{t("bank-transfer.alias")}</strong></p>
                                <p className="text-sm text-blue-700 mt-2">
                                    {t("bank-transfer.instructions")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {paymentMethod === "MERCADO_PAGO" && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Smartphone className="h-5 w-5 text-orange-600 mt-0.5" />
                            <div className="space-y-2">
                                <p className="font-medium text-orange-900">{t("mercado-pago.title")}</p>
                                <p className="text-sm text-orange-700 max-w-xl">
                                    {t("mercado-pago.description")}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
} 

export { PaymentInformation }