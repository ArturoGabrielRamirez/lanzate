import * as yup from 'yup'

const productBaseSchema = {
    name: yup.string().min(3, 'Name must be at least 3 characters long').max(50, 'Name must be less than 50 characters long').matches(/^[a-zA-Z0-9\s\.\-\_\,]+$/, 'Name must contain only letters, numbers, spaces, dots, dashes and underscores'),
    price: yup.number().min(0, 'Price must be greater than 0'),
    stock: yup.number().min(0, 'Stock must be greater than 0'),
    description: yup.string().max(255, 'Description must be less than 255 characters long'),
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