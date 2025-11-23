import * as yup from "yup"

// Per-step schemas for create store form
export const basicInfoSchemaNew = yup.object({
    basic_info: yup.object({
        name: yup.string().required("El nombre es obligatorio"),
        description: yup.string().max(255, "La descripción debe tener menos de 255 caracteres"),
        subdomain: yup.string().required("El subdominio es obligatorio"),
        logo: yup
            .mixed()
            .test("logo-type", " Tipo de archivo no soportado. Usá JPG, PNG, GIF o WebP", (value) => {
                if (value instanceof File) {
                    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
                    return allowed.includes(value.type)
                }
                return true
            })
            .test("logo-size", "Archivo demasiado grande (máx 5MB)", (value) => {
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
            isPhysicalStore ? schema.required("La dirección es obligatoria cuando la tienda es física") : schema.max(255, "La dirección debe tener menos de 255 caracteres")
        ),
        city: yup.string().when("is_physical_store", ([isPhysicalStore], schema) =>
            isPhysicalStore ? schema.required("La ciudad es obligatoria cuando la tienda es física") : schema.max(100, "La ciudad debe tener menos de 100 caracteres")
        ),
        province: yup.string().when("is_physical_store", ([isPhysicalStore], schema) =>
            isPhysicalStore ? schema.required("La provincia es obligatoria cuando la tienda es física") : schema.max(100, "La provincia debe tener menos de 100 caracteres")
        ),
        country: yup.string().when("is_physical_store", ([isPhysicalStore], schema) =>
            isPhysicalStore ? schema.required("El país es obligatorio cuando la tienda es física") : schema.max(100, "El país debe tener menos de 100 caracteres")
        ),
    })
})

export const contactInfoSchema = yup.object({
    contact_info: yup.object({
        contact_phone: yup.string().max(20, "El número de teléfono debe tener menos de 20 caracteres").required("El número de teléfono es obligatorio"),
        contact_email: yup.string().email("Formato de correo electrónico inválido").max(255, "El correo electrónico debe tener menos de 255 caracteres").required("El correo electrónico es obligatorio"),
        facebook_url: yup.string().url("Debe ser una URL válida").max(255, "La URL de Facebook debe tener menos de 255 caracteres"),
        instagram_url: yup.string().url("Debe ser una URL válida").max(255, "La URL de Instagram debe tener menos de 255 caracteres"),
        x_url: yup.string().url("Debe ser una URL válida").max(255, "La URL de X debe tener menos de 255 caracteres"),
        phones: yup.array().of(
            yup.object({
                phone: yup.string().max(20, "El número de teléfono debe tener menos de 20 caracteres").required("El número de teléfono es obligatorio"),
                is_primary: yup.boolean().default(false),
            })
        ).min(1, "Al menos un teléfono es obligatorio"),
        emails: yup.array().of(
            yup.object({
                email: yup.string().email("Formato de correo electrónico inválido").max(255, "El correo electrónico debe tener menos de 255 caracteres").required("El correo electrónico es obligatorio"),
                is_primary: yup.boolean().default(false),
            })
        ).min(1, "Al menos un correo electrónico es obligatorio"),
        social_media: yup.array().of(
            yup.object({
                social_media: yup.string().url("Debe ser una URL válida").max(255, "La URL de la red social debe tener menos de 255 caracteres").required("La URL de la red social es obligatoria"),
                is_primary: yup.boolean().default(false),
            })
        ).min(1, "Al menos una red social es obligatoria"),
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
            providers: yup.array().of(yup.string()).min(1, "Seleccioná al menos un proveedor"),
            minPurchase: yup.string(),
            freeShippingMin: yup.string(),
            estimatedTime: yup.string(),
            deliveryPrice: yup.string().matches(/^\d*$/, "Debe ser un número").required("Precio del delivery es requerido"),
        })).when("offers_delivery", (offers, schema) => offers ? schema.min(1, "Agregá al menos un modo de envío") : schema.notRequired())
    }),
    payment_info: yup.object({
        payment_methods: yup.array().of(yup.string()).min(1, "Seleccioná al menos un método de pago").required(),
    })
})

// Form type inference
export type BasicInfoFormType = yup.InferType<typeof basicInfoSchemaNew>
export type AddressInfoFormType = yup.InferType<typeof addressInfoSchema>
export type ContactInfoFormType = yup.InferType<typeof contactInfoSchema>
export type SettingsFormType = yup.InferType<typeof settingsSchema>
export type ShippingPaymentFormType = yup.InferType<typeof shippingPaymentSchema>
