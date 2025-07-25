import * as yup from "yup"

export const operationalSettingsSchema = yup.object({
    // Delivery settings
    offers_delivery: yup.boolean().required(),
    delivery_price: yup.number().min(0, "Delivery price must be positive").when('offers_delivery', {
        is: true,
        then: (schema) => schema.required("Delivery price is required when delivery is enabled")
    }),
    free_delivery_minimum: yup.number().min(0, "Free delivery minimum must be positive"),
    delivery_radius_km: yup.number().min(0.1, "Delivery radius must be at least 0.1km").max(100, "Delivery radius cannot exceed 100km"),
    
    // Business hours
    monday_open: yup.string(),
    monday_close: yup.string(),
    tuesday_open: yup.string(),
    tuesday_close: yup.string(),
    wednesday_open: yup.string(),
    wednesday_close: yup.string(),
    thursday_open: yup.string(),
    thursday_close: yup.string(),
    friday_open: yup.string(),
    friday_close: yup.string(),
    saturday_open: yup.string(),
    saturday_close: yup.string(),
    sunday_open: yup.string(),
    sunday_close: yup.string(),
    
    // Delivery and pickup times
    delivery_time_min: yup.number().min(5, "Minimum delivery time must be at least 5 minutes").max(240, "Maximum delivery time cannot exceed 4 hours"),
    delivery_time_max: yup.number().min(5, "Maximum delivery time must be at least 5 minutes").max(240, "Maximum delivery time cannot exceed 4 hours"),
    pickup_time_min: yup.number().min(5, "Minimum pickup time must be at least 5 minutes").max(120, "Maximum pickup time cannot exceed 2 hours"),
    pickup_time_max: yup.number().min(5, "Maximum pickup time must be at least 5 minutes").max(120, "Maximum pickup time cannot exceed 2 hours"),
    
    // Payment methods
    payment_methods: yup.array().of(yup.string().oneOf(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'MERCADO_PAGO', 'PAYPAL', 'CRYPTO'])).min(1, "At least one payment method is required"),
    
    // Additional settings
    requires_phone_for_delivery: yup.boolean(),
    minimum_order_amount: yup.number().min(0, "Minimum order amount must be positive"),
    preparation_time_buffer: yup.number().min(0, "Preparation buffer must be positive").max(60, "Buffer cannot exceed 60 minutes"),
    is_temporarily_closed: yup.boolean(),
    temporary_closure_reason: yup.string()
}) 