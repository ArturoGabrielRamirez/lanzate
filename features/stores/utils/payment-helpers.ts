import { PaymentMethod } from "@prisma/client"

export const mapPaymentMethodType = (type: string): PaymentMethod => {
    switch (type) {
        case 'efectivo': return PaymentMethod.CASH
        case 'credito': return PaymentMethod.CREDIT_CARD
        case 'debito': return PaymentMethod.DEBIT_CARD
        case 'transferencia': return PaymentMethod.TRANSFER
        case 'billetera_virtual': return PaymentMethod.VIRTUAL_WALLET
        case 'mercado_pago': return PaymentMethod.MERCADO_PAGO
        default: return PaymentMethod.CASH 
    }
}

export const reverseMapPaymentMethodType = (type: PaymentMethod): string => {
    switch (type) {
        case PaymentMethod.CASH: return 'efectivo'
        case PaymentMethod.CREDIT_CARD: return 'credito'
        case PaymentMethod.DEBIT_CARD: return 'debito'
        case PaymentMethod.TRANSFER: return 'transferencia'
        case PaymentMethod.VIRTUAL_WALLET: return 'billetera_virtual'
        case PaymentMethod.MERCADO_PAGO: return 'mercado_pago'
        default: return 'otro'
    }
}
