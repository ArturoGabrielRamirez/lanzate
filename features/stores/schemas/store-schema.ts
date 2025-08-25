import * as yup from 'yup'

export const schema = yup.object({
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long').max(50, 'Name must be less than 50 characters long').matches(/^[a-zA-Z0-9\s]+$/, 'Name must contain only letters, numbers and spaces'),
    description: yup.string().max(255, 'Description must be less than 255 characters long'),
    subdomain: yup.string().required('Subdomain is required').min(3, 'Subdomain must be at least 3 characters long').max(50, 'Subdomain must be less than 50 characters long').matches(/^[a-zA-Z\.]+$/, 'Subdomain must contain only letters'),
    is_physical_store: yup.boolean(),
    address: yup.string().when('is_physical_store', {
        is: true,
        then: (schema) => schema.required('Address is required when store is physical').max(255, 'Address must be less than 255 characters long'),
        otherwise: (schema) => schema.max(255, 'Address must be less than 255 characters long')
    }),
    city: yup.string().when('is_physical_store', {
        is: true,
        then: (schema) => schema.required('City is required when store is physical').max(100, 'City must be less than 100 characters long'),
        otherwise: (schema) => schema.max(100, 'City must be less than 100 characters long')
    }),
    province: yup.string().when('is_physical_store', {
        is: true,
        then: (schema) => schema.required('Province is required when store is physical').max(100, 'Province must be less than 100 characters long'),
        otherwise: (schema) => schema.max(100, 'Province must be less than 100 characters long')
    }),
    country: yup.string().when('is_physical_store', {
        is: true,
        then: (schema) => schema.required('Country is required when store is physical').max(100, 'Country must be less than 100 characters long'),
        otherwise: (schema) => schema.max(100, 'Country must be less than 100 characters long')
    }),
})

export const editSchema = yup.object({
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long').max(50, 'Name must be less than 50 characters long').matches(/^[a-zA-Z0-9\s]+$/, 'Name must contain only letters, numbers and spaces'),
    description: yup.string().max(255, 'Description must be less than 255 characters long'),
    subdomain: yup.string().required('Subdomain is required').min(3, 'Subdomain must be at least 3 characters long').max(50, 'Subdomain must be less than 50 characters long').matches(/^[a-zA-Z\.]+$/, 'Subdomain must contain only letters'),
    contact_phone: yup.string().max(20, 'Phone must be less than 20 characters long').matches(/^[0-9+\-\s\(\)]*$/, 'Phone must contain only numbers, spaces, and phone symbols'),
    contact_whatsapp: yup.string().max(20, 'WhatsApp must be less than 20 characters long').matches(/^[0-9+\-\s\(\)]*$/, 'WhatsApp must contain only numbers, spaces, and phone symbols'),
    facebook_url: yup.string().url('Must be a valid URL').max(255, 'Facebook URL must be less than 255 characters long'),
    instagram_url: yup.string().url('Must be a valid URL').max(255, 'Instagram URL must be less than 255 characters long'),
    x_url: yup.string().url('Must be a valid URL').max(255, 'X URL must be less than 255 characters long'),
    is_physical_store: yup.boolean(),
    address: yup.string().when('is_physical_store', {
        is: true,
        then: (schema) => schema.required('Address is required when store is physical').max(255, 'Address must be less than 255 characters long'),
        otherwise: (schema) => schema.max(255, 'Address must be less than 255 characters long')
    }),
    city: yup.string().when('is_physical_store', {
        is: true,
        then: (schema) => schema.required('City is required when store is physical').max(100, 'City must be less than 100 characters long'),
        otherwise: (schema) => schema.max(100, 'City must be less than 100 characters long')
    }),
    province: yup.string().when('is_physical_store', {
        is: true,
        then: (schema) => schema.required('Province is required when store is physical').max(100, 'Province must be less than 100 characters long'),
        otherwise: (schema) => schema.max(100, 'Province must be less than 100 characters long')
    }),
    country: yup.string().when('is_physical_store', {
        is: true,
        then: (schema) => schema.required('Country is required when store is physical').max(100, 'Country must be less than 100 characters long'),
        otherwise: (schema) => schema.max(100, 'Country must be less than 100 characters long')
    }),
})
