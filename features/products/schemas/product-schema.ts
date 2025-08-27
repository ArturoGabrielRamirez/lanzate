import * as yup from 'yup'

const productBaseSchema = {
    name: yup.string().min(3, 'Name must be at least 3 characters long').max(50, 'Name must be less than 50 characters long').matches(/^[a-zA-Z0-9\s\.\-\_\,]+$/, 'Name must contain only letters, numbers, spaces, dots, dashes and underscores'),
    slug: yup.string()
        .trim()
        .transform((v) => (v === '' ? undefined : v))
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug must be lowercase, numbers and hyphens', excludeEmptyString: true })
        .max(60, 'Slug must be less than 60 characters long')
        .optional(),
    price: yup.number().min(0, 'Price must be greater than 0'),
    stock: yup.number().min(0, 'Stock must be greater than 0'),
    description: yup.string().max(255, 'Description must be less than 255 characters long').optional(),
    sku: yup.string()
        .trim()
        .transform((v) => (v === '' ? undefined : v))
        .matches(/^[A-Za-z0-9\-\_\.]+$/, { message: 'SKU must be alphanumeric and can include - _ .', excludeEmptyString: true })
        .max(64, 'SKU must be less than 64 characters long')
        .optional(),
    barcode: yup.string()
        .trim()
        .transform((v) => (v === '' ? undefined : v))
        .matches(/^[0-9]*$/, { message: 'Barcode must contain only numbers', excludeEmptyString: true })
        .max(64, 'Barcode must be less than 64 characters long')
        .optional(),
    is_active: yup.boolean().optional(),
    is_featured: yup.boolean().optional(),
    is_published: yup.boolean().optional(),
    categories: yup.array().of(yup.object({
        value: yup.string().required('Category is required'),
        label: yup.string().required('Category is required'),
    })).optional(),
    /* image: yup.mixed().optional(), */
}

export const productCreateSchema = yup.object({
    ...productBaseSchema,
    name: productBaseSchema.name.required('Name is required'),
    price: productBaseSchema.price.required('Price is required'),
    stock: productBaseSchema.stock.required('Stock is required'),
})

export const productUpdateSchema = yup.object({
    ...productBaseSchema,
})