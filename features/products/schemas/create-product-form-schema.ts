import * as yup from "yup"

// Enums mirroring Prisma
export enum ProductType {
    PHYSICAL = "PHYSICAL",
    DIGITAL = "DIGITAL",
    SERVICE = "SERVICE"
}

export enum ProductStatus {
    ACTIVE = "ACTIVE",
    DRAFT = "DRAFT",
    ARCHIVED = "ARCHIVED"
}

export enum WeightUnit {
    KG = "KG",
    G = "G",
    LB = "LB",
    OZ = "OZ"
}

export enum LengthUnit {
    CM = "CM",
    M = "M",
    IN = "IN",
    FT = "FT"
}

// Basic Info Schema
export const productBasicInfoSchema = yup.object({
    basic_info: yup.object({
        name: yup.string().required("El nombre es obligatorio").min(3, "Mínimo 3 caracteres"),
        type: yup.mixed<ProductType>().oneOf(Object.values(ProductType)).default(ProductType.PHYSICAL),
        slug: yup.string()
            .transform(v => v === "" ? undefined : v)
            .matches(/^[a-z0-9\-]+$/, "El slug solo puede contener letras minúsculas, números y guiones (sin espacios)")
            .optional(),
        description: yup.string().optional(),
        brand: yup.string().optional(),
        tags: yup.array().of(yup.string()).optional(),
        category_ids: yup.array().of(yup.number()).min(1, "Debes seleccionar al menos una categoría").optional(), // Optional in schema to avoid blocking drafts, but UI might require it
    })
})

// Media Schema (Images/Videos)
export const productMediaSchema = yup.object({
    media_info: yup.object({
        images: yup.array().optional(), // Will handle File[] or {url, file}[] validation loosely for now
        video_url: yup.string().url("URL inválida").optional().nullable(),
    })
})

// Options & Variants Schema
export const productOptionsVariantsSchema = yup.object({
    options_variants_info: yup.object({
        has_variants: yup.boolean().default(false),
        options: yup.array().of(
            yup.object({
                id: yup.string().optional(), // temp id for UI
                name: yup.string().required("El nombre de la opción es requerido"),
                values: yup.array().of(
                    yup.object({
                        id: yup.string().optional(),
                        value: yup.string().required()
                    })
                ).min(1, "Debe tener al menos un valor")
            })
        ).optional(),
        variants: yup.array().of(
            yup.object({
                id: yup.string().optional(),
                name: yup.string(),
                sku: yup.string().optional(),
                price: yup.number().min(0).default(0),
                stock: yup.number().min(0).default(0),
                // Add more variant specific fields if needed (weight, dimensions per variant)
            })
        ).optional()
    })
})

// Price & Stock Schema (Mostly for Simple Products)
export const productPriceStockSchema = yup.object({
    price_stock_info: yup.object({
        sku: yup.string()
            .transform(v => v === "" ? undefined : v)
            .matches(/^[a-zA-Z0-9\-\_\.]+$/, "El SKU solo puede contener caracteres alfanuméricos, guiones, guiones bajos y puntos")
            .optional(),
        barcode: yup.string()
            .transform(v => v === "" ? undefined : v)
            .matches(/^[a-zA-Z0-9\-\.\$\/\+\%]*$/, "El código de barras no es válido")
            .optional(),
        price: yup.number().min(0, "El precio no puede ser negativo").required("El precio es obligatorio"),
        promotional_price: yup.number().min(0, "El precio promocional no puede ser negativo").optional().nullable(),
        cost: yup.number().min(0, "El costo no puede ser negativo").optional(),
        
        // Inventory
        stock: yup.number().min(0, "El stock no puede ser negativo").required("El stock es obligatorio"),
        stock_unlimited: yup.boolean().default(false),
        track_stock: yup.boolean().default(true),
    })
})

// Shipping Schema
export const productShippingSchema = yup.object({
    shipping_info: yup.object({
        free_shipping: yup.boolean().default(false),
        weight: yup.number().min(0).optional(),
        weight_unit: yup.mixed<WeightUnit>().oneOf(Object.values(WeightUnit)).default(WeightUnit.KG),
        dimensions: yup.object({
            width: yup.number().min(0).optional(),
            height: yup.number().min(0).optional(),
            depth: yup.number().min(0).optional(),
            unit: yup.mixed<LengthUnit>().oneOf(Object.values(LengthUnit)).default(LengthUnit.CM)
        }).optional()
    })
})

// Settings & SEO Schema
export const productSettingsSchema = yup.object({
    settings_info: yup.object({
        // Visibility
        status: yup.mixed<ProductStatus>().oneOf(Object.values(ProductStatus)).default(ProductStatus.ACTIVE),
        is_featured: yup.boolean().default(false),
        is_new: yup.boolean().default(false),
        is_on_sale: yup.boolean().default(false),
        
        // Marketing
        allow_promotions: yup.boolean().default(true), // "Permitir cupones"
        
        // SEO
        seo_title: yup.string().max(60, "Máximo 60 caracteres").optional(),
        seo_description: yup.string().max(160, "Máximo 160 caracteres").optional(),
    })
})

// Combined Schema
export const createProductSchema = productBasicInfoSchema
    .concat(productMediaSchema)
    .concat(productOptionsVariantsSchema)
    .concat(productPriceStockSchema)
    .concat(productShippingSchema)
    .concat(productSettingsSchema)

// Types
export type ProductBasicInfoFormType = yup.InferType<typeof productBasicInfoSchema>
export type ProductMediaFormType = yup.InferType<typeof productMediaSchema>
export type ProductOptionsVariantsFormType = yup.InferType<typeof productOptionsVariantsSchema>
export type ProductPriceStockFormType = yup.InferType<typeof productPriceStockSchema>
export type ProductShippingFormType = yup.InferType<typeof productShippingSchema>
export type ProductSettingsFormType = yup.InferType<typeof productSettingsSchema>

export type CreateProductFormType = yup.InferType<typeof createProductSchema>
