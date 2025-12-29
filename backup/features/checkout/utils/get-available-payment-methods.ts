import { PaymentMethod } from "@prisma/client"
import { Banknote, CreditCard, Smartphone } from "lucide-react"

export type PaymentMethodOption = {
    value: PaymentMethod
    label: string
    icon: typeof Banknote | typeof CreditCard | typeof Smartphone
}

/**
 * Filters and returns available payment methods based on store settings
 * @param allowedPaymentMethods - Array of payment methods allowed by the store
 * @param translations - Translation function for labels
 * @returns Array of available payment method options
 */
export function getAvailablePaymentMethods(
    allowedPaymentMethods: PaymentMethod[],
    translations: {
        cash: string
        creditDebitCard: string
        bankTransfer: string
        mercadoPago: string
        paypal: string
        crypto: string
    }
): PaymentMethodOption[] {
    const allPaymentMethods: PaymentMethodOption[] = [
        { value: "CASH", label: translations.cash, icon: Banknote },
        { value: "CREDIT_CARD", label: translations.creditDebitCard, icon: CreditCard },
        { value: "DEBIT_CARD", label: translations.creditDebitCard, icon: CreditCard },
        { value: "TRANSFER", label: translations.bankTransfer, icon: Banknote },
        { value: "MERCADO_PAGO", label: translations.mercadoPago, icon: Smartphone },
        { value: "PAYPAL", label: translations.paypal, icon: CreditCard },
        { value: "CRYPTO", label: translations.crypto, icon: CreditCard },
    ]
    
    return allPaymentMethods.filter(method => allowedPaymentMethods.includes(method.value))
}
