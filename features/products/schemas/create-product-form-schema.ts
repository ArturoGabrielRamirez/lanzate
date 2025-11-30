import * as yup from "yup"

// Basic Info Schema
export const productBasicInfoSchema = yup.object({
    basic_info: yup.object({
        name: yup.string().required("El nombre es obligatorio").min(3, "Mínimo 3 caracteres"),
        description: yup.string().optional(),
        slug: yup.string().optional(),
        sku: yup.string().optional(),
        barcode: yup.string().optional(),
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
export const createProductSchema = productBasicInfoSchema
    .concat(productMediaSchema)
    .concat(productPriceStockSchema)
    .concat(productSettingsSchema)

// Types
export type ProductBasicInfoFormType = yup.InferType<typeof productBasicInfoSchema>
export type ProductMediaFormType = yup.InferType<typeof productMediaSchema>
export type ProductPriceStockFormType = yup.InferType<typeof productPriceStockSchema>
export type ProductSettingsFormType = yup.InferType<typeof productSettingsSchema>

export type CreateProductFormType = yup.InferType<typeof createProductSchema>

