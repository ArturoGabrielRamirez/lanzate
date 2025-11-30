import * as yup from "yup"

// Source Schema
export const productSourceSchema = yup.object({
    source_info: yup.object({
        type: yup.string().oneOf(["AI", "FILE", "MANUAL"], "Selecciona un método válido").required("El método es obligatorio"),
    })
})

// Basic Info Schema
export const productBasicInfoSchema = yup.object({
    basic_info: yup.object({
        name: yup.string().required("El nombre es obligatorio").min(3, "Mínimo 3 caracteres"),
        description: yup.string().optional(),
        slug: yup.string().transform(v => v === "" ? undefined : v).matches(/^[a-z0-9\-]+$/, "El slug solo puede contener letras minúsculas, números y guiones (sin espacios)").optional(),
        sku: yup.string().transform(v => v === "" ? undefined : v).matches(/^[a-zA-Z0-9\-\_\.]+$/, "El SKU solo puede contener caracteres alfanuméricos, guiones, guiones bajos y puntos (sin espacios)").optional(),
        barcode: yup.string().transform(v => v === "" ? undefined : v).matches(/^[a-zA-Z0-9\-\.\$\/\+\%]*$/, "El código de barras no es válido (sin espacios, solo alfanuméricos y - . $ / + %)").optional(),
    })
})

// Media Schema (Images/Videos)
export const productMediaSchema = yup.object({
    media_info: yup.object({
        images: yup.array().optional(), // Will handle File[] validation loosely for now
        video_url: yup.string().url("URL inválida").optional().nullable(),
    })
})

// Price & Stock Schema
export const productPriceStockSchema = yup.object({
    price_stock_info: yup.object({
        price: yup.number().min(0, "El precio no puede ser negativo").required("El precio es obligatorio"),
        stock: yup.number().min(0, "El stock no puede ser negativo").required("El stock es obligatorio"),
        cost: yup.number().min(0, "El costo no puede ser negativo").optional(),
    })
})

// Settings Schema
export const productSettingsSchema = yup.object({
    settings_info: yup.object({
        is_active: yup.boolean().default(true),
        is_featured: yup.boolean().default(false),
        is_published: yup.boolean().default(true),
    })
})

// Combined Schema
export const createProductSchema = productSourceSchema
    .concat(productBasicInfoSchema)
    .concat(productMediaSchema)
    .concat(productPriceStockSchema)
    .concat(productSettingsSchema)

// Types
export type ProductSourceFormType = yup.InferType<typeof productSourceSchema>
export type ProductBasicInfoFormType = yup.InferType<typeof productBasicInfoSchema>
export type ProductMediaFormType = yup.InferType<typeof productMediaSchema>
export type ProductPriceStockFormType = yup.InferType<typeof productPriceStockSchema>
export type ProductSettingsFormType = yup.InferType<typeof productSettingsSchema>

export type CreateProductFormType = yup.InferType<typeof createProductSchema>

