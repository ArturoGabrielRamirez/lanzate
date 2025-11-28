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

