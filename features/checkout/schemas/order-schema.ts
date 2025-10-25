import * as yup from 'yup'

const personalInfoSchema = {
    name: yup.string().required('Name is required'),
    email: yup.string().email('Email must be a valid email').required('Email is required'),
    phone: yup.string().required('Phone is required'),
}

const shippingInfoSchema = {
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    country: yup.string().required('Country is required'),
}

const orderMethodSchema = {
    shippingMethod: yup.string().oneOf(['DELIVERY', 'PICKUP']).required('Shipping method is required'),
    branchId: yup.number().required('Branch selection is required'),
}

const paymentMethodSchema = {
    paymentMethod: yup.string().oneOf(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'MERCADO_PAGO', 'PAYPAL', 'CRYPTO']).required('Payment method is required'),
}

export const pickupOrderSchema = yup.object({
    ...personalInfoSchema,
    ...orderMethodSchema,
    ...paymentMethodSchema,
}).test('card-info-required', 'Card information is required for credit/debit payment', function(value: any) {
    if (value.paymentMethod === 'credit-debit') {
        const cardFields = ['cardNumber', 'cardHolder', 'expiryDate', 'cvv']
        const missingFields = cardFields.filter(field => !value[field])
        if (missingFields.length > 0) {
            return this.createError({ message: 'Card information is required for credit/debit payment' })
        }
    }
    return true
})

export const deliveryOrderSchema = yup.object({
    ...personalInfoSchema,
    ...orderMethodSchema,
    ...paymentMethodSchema,
    ...shippingInfoSchema,
}).test('card-info-required', 'Card information is required for credit/debit payment', function(value: any) {
    if (value.paymentMethod === 'credit-debit') {
        const cardFields = ['cardNumber', 'cardHolder', 'expiryDate', 'cvv']
        const missingFields = cardFields.filter(field => !value[field])
        if (missingFields.length > 0) {
            return this.createError({ message: 'Card information is required for credit/debit payment' })
        }
    }
    return true
})

