import * as yup from 'yup'

import { validateCardInfo } from '@/features/checkout/utils/validate-card-info'


const personalInfoSchema = {
    name: yup.string().required('El nombre es obligatorio'),
    email: yup.string().email('El correo electrónico debe ser un correo válido').required('El correo electrónico es obligatorio'),
    phone: yup.string().required('El teléfono es obligatorio'),
}

const shippingInfoSchema = {
    address: yup.string().required('La dirección es obligatoria'),
    city: yup.string().required('La ciudad es obligatoria'),
    state: yup.string().required('El estado es obligatorio'),
    country: yup.string().required('El país es obligatorio'),
}

const orderMethodSchema = {
    shippingMethod: yup.string().oneOf(['DELIVERY', 'PICKUP']).required('El método de envío es obligatorio'),
    branchId: yup.number().required('La selección de sucursal es obligatoria'),
}

const paymentMethodSchema = {
    paymentMethod: yup.string().oneOf(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'MERCADO_PAGO', 'PAYPAL', 'CRYPTO']).required('El método de pago es obligatorio'),
}

export const pickupOrderSchema = yup.object({
    ...personalInfoSchema,
    ...orderMethodSchema,
    ...paymentMethodSchema,
}).test('card-info-required', 'Card information is required for credit/debit payment', function (value) {
    const result = validateCardInfo(value.paymentMethod, value)
    if (result !== true) {
        return this.createError({ message: result as string })
    }
    return true
})

export const deliveryOrderSchema = yup.object({
    ...personalInfoSchema,
    ...orderMethodSchema,
    ...paymentMethodSchema,
    ...shippingInfoSchema,
}).test('card-info-required', 'La información de la tarjeta es obligatoria para el pago con crédito/débito', function (value) {
    const result = validateCardInfo(value.paymentMethod, value)
    if (result !== true) {
        return this.createError({ message: result as string })
    }
    return true
})

