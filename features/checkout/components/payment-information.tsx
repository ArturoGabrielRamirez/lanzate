"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { InputField } from "@/features/layout/components"
import { CreditCard, Banknote, Smartphone } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { PaymentMethod } from "@prisma/client"

interface PaymentInformationProps {
    paymentMethod: PaymentMethod
    onChange: (method: PaymentMethod) => void
}

export function PaymentInformation({ paymentMethod, onChange }: PaymentInformationProps) {
    const { setValue } = useFormContext()

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
                    Select Payment Method
                </Label>
                <Select
                    value={paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a payment method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CREDIT_CARD">
                            <div className="flex items-center gap-2">
                                <CreditCard className="size-4" />
                                Credit/Debit Card
                            </div>
                        </SelectItem>
                        <SelectItem value="TRANSFER">
                            <div className="flex items-center gap-2">
                                <Banknote className="size-4" />
                                Bank Transfer
                            </div>
                        </SelectItem>
                        <SelectItem value="MERCADO_PAGO">
                            <div className="flex items-center gap-2">
                                <Smartphone className="size-4" />
                                Mercado Pago
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Conditional Payment Fields */}
            {(paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD") && (
                <div className="space-y-4">
                    <Label className="text-base font-medium block">Card Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            name="cardNumber"
                            label="Card Number"
                            placeholder="1234 5678 9012 3456"
                            onChange={(e) => handleCardFieldChange("cardNumber", e.target.value)}
                        />
                        <InputField
                            name="cardHolder"
                            label="Cardholder Name"
                            placeholder="John Doe"
                            onChange={(e) => handleCardFieldChange("cardHolder", e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            name="expiryDate"
                            label="Expiry Date"
                            placeholder="MM/YY"
                            onChange={(e) => handleCardFieldChange("expiryDate", e.target.value)}
                        />
                        <InputField
                            name="cvv"
                            label="CVV"
                            placeholder="123"
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
                                <p className="font-medium text-blue-900">Bank Transfer Details:</p>
                                <p className="text-sm text-accent"><strong>CVU:</strong> 0000003100061234567890</p>
                                <p className="text-sm text-accent"><strong>Alias:</strong> MI.TIENDA.ONLINE</p>
                                <p className="text-sm text-blue-700 mt-2">
                                    Please include your order number in the transfer description.
                                    Your order will be confirmed once the payment is received.
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
                                <p className="font-medium text-orange-900">Mercado Pago Payment</p>
                                <p className="text-sm text-orange-700 max-w-xl">
                                    When you click "Confirm Order", you will be redirected to Mercado Pago
                                    to complete your payment securely. After payment, you will be brought
                                    back to our site with your order confirmation.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
} 