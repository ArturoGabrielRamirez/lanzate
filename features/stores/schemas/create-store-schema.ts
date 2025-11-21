import * as yup from "yup"

// Per-step schemas for create store form
export const basicInfoSchemaNew = yup.object({
    basic_info: yup.object({
        name: yup.string().required("Name is required"),
        description: yup.string().max(255, "Description must be less than 255 characters long"),
        subdomain: yup.string().required("Subdomain is required"),
        logo: yup
            .mixed()
            .test("logo-type", "Unsupported file type. Use JPG, PNG, GIF or WebP", (value) => {
                if (value instanceof File) {
                    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
                    return allowed.includes(value.type)
                }
                return true
            })
            .test("logo-size", "File too large (max 5MB)", (value) => {
                if (value instanceof File) {
                    return value.size <= 5 * 1024 * 1024
                }
                return true
            }).nullable().optional(),
    })
})

export const addressInfoSchema = yup.object({
    address_info: yup.object({
        is_physical_store: yup.boolean().default(false),
        address: yup.string().when("is_physical_store", ([isPhysicalStore], schema) =>
            isPhysicalStore ? schema.required("Address is required when store is physical") : schema.max(255, "Address must be less than 255 characters long")
        ),
        city: yup.string().when("is_physical_store", ([isPhysicalStore], schema) =>
            isPhysicalStore ? schema.required("City is required when store is physical") : schema.max(100, "City must be less than 100 characters long")
        ),
        province: yup.string().when("is_physical_store", ([isPhysicalStore], schema) =>
            isPhysicalStore ? schema.required("Province is required when store is physical") : schema.max(100, "Province must be less than 100 characters long")
        ),
        country: yup.string().when("is_physical_store", ([isPhysicalStore], schema) =>
            isPhysicalStore ? schema.required("Country is required when store is physical") : schema.max(100, "Country must be less than 100 characters long")
        ),
    })
})

export const contactInfoSchema = yup.object({
    contact_info: yup.object({
        contact_phone: yup.string().max(20, "Phone must be less than 20 characters long").required("Phone is required").matches(/^[0-9+\-\s\(\)]*$/, "Phone must be a number"),
        contact_email: yup.string().email("Must be a valid email").max(255, "Email must be less than 255 characters long").required("Email is required"),
        facebook_url: yup.string().url("Must be a valid URL").max(255, "Facebook URL must be less than 255 characters long"),
        instagram_url: yup.string().url("Must be a valid URL").max(255, "Instagram URL must be less than 255 characters long"),
        x_url: yup.string().url("Must be a valid URL").max(255, "X URL must be less than 255 characters long"),
    })
})

export const settingsSchema = yup.object({
    settings: yup.object({
        is_open_24_hours: yup.boolean().default(true),
        attention_dates: yup
            .array()
            .of(
                yup.object({
                    days: yup.array().of(yup.string()),
                    startTime: yup.string(),
                    endTime: yup.string(),
                })
            )
            .default([])
            .test("must-have-at-least-one-when-scheduled", "Debe configurar al menos un día de atención", function (value) {
                const isOpen = this.parent?.is_open_24_hours
                if (isOpen) return true
                return Array.isArray(value) && value.length > 0
            })
    })
})

export const shippingPaymentSchema = yup.object({
    shipping_info: yup.object({
        offers_delivery: yup.boolean().default(false),
        methods: yup.array().of(yup.object({
            providers: yup.array().of(yup.string()).min(1, "Seleccione al menos un proveedor"),
            minPurchase: yup.string(),
            freeShippingMin: yup.string(),
            estimatedTime: yup.string(),
            deliveryPrice: yup.string().matches(/^\d*$/, "Debe ser un número").required("Precio del delivery es requerido"),
        })).when("offers_delivery", (offers, schema) => offers ? schema.min(1, "Agregue al menos un modo de envío") : schema.notRequired())
    }),
    payment_info: yup.object({
        payment_methods: yup.array().of(yup.string()).min(1, "Seleccione al menos un método de pago").required("Seleccione al menos un método de pago"),
    })
})

// Form type inference
export type BasicInfoFormType = yup.InferType<typeof basicInfoSchemaNew>
export type AddressInfoFormType = yup.InferType<typeof addressInfoSchema>
export type ContactInfoFormType = yup.InferType<typeof contactInfoSchema>
export type SettingsFormType = yup.InferType<typeof settingsSchema>
export type ShippingPaymentFormType = yup.InferType<typeof shippingPaymentSchema>
