/**
 * Validates if card information is complete for credit/debit card payments
 * @param paymentMethod - The selected payment method
 * @param value - The form values object containing card fields
 * @returns true if validation passes, error message if fails
 */
export function validateCardInfo(paymentMethod: string, value: Record<string, unknown>): string | true {
    if (paymentMethod === 'credit-debit' || paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') {
        const cardFields = ['cardNumber', 'cardHolder', 'expiryDate', 'cvv']
        const missingFields = cardFields.filter(field => !value[field])
        
        if (missingFields.length > 0) {
            return 'La información de la tarjeta es obligatoria para el pago con crédito/débito'
        }
    }
    return true
}
