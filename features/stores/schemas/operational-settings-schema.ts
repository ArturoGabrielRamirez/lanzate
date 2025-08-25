import * as yup from "yup"

export const editOperationalSettingsSchema = yup.object({
    offers_delivery: yup.boolean().required(),
    delivery_price: yup.string().when("offers_delivery", {
        is: true,
        then: (schema) => schema
            .required("Delivery price is required")
            .matches(/^\d+(?:\.\d+)?$/, "Must be a valid number"),
        otherwise: (schema) => schema.optional(),
    }),
    free_delivery_minimum: yup.string().when("offers_delivery", {
        is: true,
        then: (schema) => schema
            .optional()
            .matches(/^$|^\d+(?:\.\d+)?$/, "Must be a valid number"),
        otherwise: (schema) => schema.optional(),
    }),
    delivery_radius_km: yup.string().when("offers_delivery", {
        is: true,
        then: (schema) => schema
            .required("Delivery radius is required")
            .matches(/^\d+$/, "Must be a whole number"),
        otherwise: (schema) => schema.optional(),
    }),
    minimum_order_amount: yup
        .string()
        .required("Minimum order amount is required")
        .matches(/^\d+(?:\.\d+)?$/, "Must be a valid number"),
})

export type EditOperationalSettingsData = yup.InferType<typeof editOperationalSettingsSchema>

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
    minimum_order_amount: yup.number().min(0, 'Minimum order amount must be 0 or greater'),
    payment_methods: yup.array().of(yup.string()).min(1, 'At least one payment method must be selected').required()
}) 