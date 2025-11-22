import * as yup from 'yup'

const lengthUnits = ["MM", "CM", "M", "IN", "FT"] as const
const weightUnits = ["MG", "G", "KG", "OZ", "LB"] as const

const productBaseSchema = {
    name: yup.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(50, 'El nombre debe tener menos de 50 caracteres').matches(/^[a-zA-Z0-9\s\.\-\_\,]+$/, 'El nombre solo puede contener letras, números, espacios, puntos, guiones y guiones bajos'),
    slug: yup.string()
        .trim()
        .transform((v) => (v === '' ? undefined : v))
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'El slug debe contener solo minúsculas, números y guiones', excludeEmptyString: true })
        .max(60, 'El slug debe tener menos de 60 caracteres')
        .optional(),
    price: yup.number().min(0, 'El precio debe ser mayor o igual a 0'),
    stock: yup.number().min(0, 'El stock debe ser mayor o igual a 0'),
    description: yup.string().max(255, 'La descripción debe tener menos de 255 caracteres').optional(),
    sku: yup.string()
        .trim()
        .transform((v) => (v === '' ? undefined : v))
        .matches(/^[A-Za-z0-9\-\_\.]+$/, { message: 'El SKU debe ser alfanumérico y puede incluir - _ .', excludeEmptyString: true })
        .max(64, 'El SKU debe tener menos de 64 caracteresq')
        .optional(),
    barcode: yup.string()
        .trim()
        .transform((v) => (v === '' ? undefined : v))
        .matches(/^[0-9]*$/, { message: 'El código de barras debe contener solo números', excludeEmptyString: true })
        .max(64, 'El código de barras debe tener menos de 64 caracteres')
        .optional(),
    is_active: yup.boolean().optional(),
    is_featured: yup.boolean().optional(),
    is_published: yup.boolean().optional(),
    categories: yup.array().of(yup.object({
        value: yup.string().required('La categoría es obligatoria'),
        label: yup.string().required('La categoría es obligatoria'),
    })).optional(),
    /* image: yup.mixed().optional(), */

    // Optional product colors; if present, each must have a name
    colors: yup.array().of(
        yup.object({
            id: yup.string().optional(),
            name: yup.string().trim().required('El nombre del color es obligatorio'),
            rgba: yup.array().of(yup.number()).length(4).optional(),
        })
    ).optional(),

    // Optional dimensions (non-negative)
    height: yup.number()
        .transform((v, o) => (o === '' || o === null ? undefined : v))
        .min(0, 'La altura debe ser mayor o igual a 0')
        .optional(),
    heightUnit: yup.string()
        .transform((v) => (v === '' ? undefined : v))
        .oneOf(lengthUnits as unknown as string[], 'Unidad de altura inválida')
        .optional(),
    width: yup.number()
        .transform((v, o) => (o === '' || o === null ? undefined : v))
        .min(0, 'El ancho debe ser mayor o igual a 0')
        .optional(),
    widthUnit: yup.string()
        .transform((v) => (v === '' ? undefined : v))
        .oneOf(lengthUnits as unknown as string[], 'Unidad de ancho inválida')
        .optional(),
    depth: yup.number()
        .transform((v, o) => (o === '' || o === null ? undefined : v))
        .min(0, 'La profundidad debe ser mayor o igual a 0')
        .optional(),
    depthUnit: yup.string()
        .transform((v) => (v === '' ? undefined : v))
        .oneOf(lengthUnits as unknown as string[], 'Unidad de profundidad inválida')
        .optional(),
    diameter: yup.number()
        .transform((v, o) => (o === '' || o === null ? undefined : v))
        .min(0, 'El diámetro debe ser mayor o igual a 0')
        .optional(),
    diameterUnit: yup.string()
        .transform((v) => (v === '' ? undefined : v))
        .oneOf(lengthUnits as unknown as string[], 'Unidad de diámetro inválida')
        .optional(),
    weight: yup.number()
        .transform((v, o) => (o === '' || o === null ? undefined : v))
        .min(0, 'El peso debe ser mayor o igual a 0')
        .optional(),
    weightUnit: yup.string()
        .transform((v) => (v === '' ? undefined : v))
        .oneOf(weightUnits as unknown as string[], 'Unidad de peso inválida')
        .optional(),
}

export const productCreateSchema = yup.object({
    ...productBaseSchema,
    name: productBaseSchema.name.required('El nombre es obligatorio'),
    price: productBaseSchema.price.required('El precio es obligatorio'),
    stock: productBaseSchema.stock.required('El stock es obligatorio'),
})

export const productUpdateSchema = yup.object({
    ...productBaseSchema,
})

export const editProductSchema = yup.object({
    name: productBaseSchema.name.required('El nombre es obligatorio'),
    description: productBaseSchema.description,
    sku: productBaseSchema.sku,
    barcode: productBaseSchema.barcode,
    price: productBaseSchema.price.required('El precio es obligatorio'),
    stock: productBaseSchema.stock.required('El stock es obligatorio'),
})

export const editVariantSchema = yup.object({
    name: yup.string().required('El nombre es obligatorio').min(3, 'El nombre debe tener al menos 3 caracteres').max(50, 'El nombre debe tener menos de 50 caracteres'),
    sku: yup.string()
        .trim()
        .transform((v) => (v === '' ? undefined : v))
        .matches(/^[A-Za-z0-9\-\_\.]+$/, { message: 'SKU debe ser alfanumérico y puede incluir - _ .', excludeEmptyString: true })
        .max(64, 'SKU debe tener menos de 64 caracteres')
        .optional(),
    barcode: yup.string()
        .trim()
        .transform((v) => (v === '' ? undefined : v))
        .matches(/^[0-9]*$/, { message: 'El código de barras debe contener solo números', excludeEmptyString: true })
        .max(64, 'El código de barras debe tener menos de 64 caracteres')
        .optional(),
    description: yup.string()
        .max(255, 'La descripción debe tener menos de 255 caracteres')
        .optional(),
})