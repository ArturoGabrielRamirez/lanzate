"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { InputField } from "@/features/layout/components"
import { CreditCard, Banknote, Smartphone } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { PaymentMethod } from "@prisma/client"
import { useTranslations } from "next-intl"

interface PaymentInformationProps {
    paymentMethod: PaymentMethod
    onChange: (method: PaymentMethod) => void
}

export function PaymentInformation({ paymentMethod, onChange }: PaymentInformationProps) {
    const { setValue } = useFormContext()
    const t = useTranslations("checkout.payment")

    const handlePaymentMethodChange = (value: PaymentMethod) => {
        onChange(value)
        setValue("paymentMethod", value)
    }

    const handleCardFieldChange = (fieldName: string, value: string) => {
        setValue(fieldName, value)
    }

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
                        <SelectItem value="CREDIT_CARD">
                            <div className="flex items-center gap-2">
                                <CreditCard className="size-4" />
                                {t("method-selector.credit-debit-card")}
                            </div>
                        </SelectItem>
                        <SelectItem value="TRANSFER">
                            <div className="flex items-center gap-2">
                                <Banknote className="size-4" />
                                {t("method-selector.bank-transfer")}
                            </div>
                        </SelectItem>
                        <SelectItem value="MERCADO_PAGO">
                            <div className="flex items-center gap-2">
                                <Smartphone className="size-4" />
                                {t("method-selector.mercado-pago")}
                            </div>
                        </SelectItem>
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