import * as yup from 'yup'

export const schema = yup.object({
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long').max(50, 'Name must be less than 50 characters long').matches(/^[a-zA-Z0-9\s]+$/, 'Name must contain only letters, numbers and spaces'),
    price: yup.number().required('Price is required').min(0, 'Price must be greater than 0'),
    stock: yup.number().required('Stock is required').min(0, 'Stock must be greater than 0'),
})

export const editSchema = yup.object({
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long').max(50, 'Name must be less than 50 characters long').matches(/^[a-zA-Z0-9\s]+$/, 'Name must contain only letters, numbers and spaces'),
    price: yup.number().required('Price is required').min(0, 'Price must be greater than 0'),
    stock: yup.number().required('Stock is required').min(0, 'Stock must be greater than 0'),
    description: yup.string().max(255, 'Description must be less than 255 characters long'),
})