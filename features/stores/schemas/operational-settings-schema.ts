import * as yup from "yup"

export const operationalSettingsSchema = yup.object({
    offers_delivery: yup.boolean().required(),
    delivery_price: yup.number().when('offers_delivery', {
        is: true,
        then: (schema) => schema.min(0, 'Delivery price must be 0 or greater').required('Delivery price is required when delivery is enabled'),
        otherwise: (schema) => schema.notRequired()
    }),
    free_delivery_minimum: yup.number().when('offers_delivery', {
        is: true,
        then: (schema) => schema.min(0, 'Free delivery minimum must be 0 or greater').nullable(),
        otherwise: (schema) => schema.notRequired()
    }),
    delivery_radius_km: yup.number().when('offers_delivery', {
        is: true,
        then: (schema) => schema.min(1, 'Delivery radius must be at least 1 km').max(100, 'Delivery radius cannot exceed 100 km').required('Delivery radius is required when delivery is enabled'),
        otherwise: (schema) => schema.notRequired()
    }),
    minimum_order_amount: yup.number().min(0, 'Minimum order amount must be 0 or greater').required(),
    payment_methods: yup.array().of(yup.string()).min(1, 'At least one payment method must be selected').required()
}) 