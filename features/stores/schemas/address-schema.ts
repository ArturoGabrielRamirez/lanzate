import * as yup from 'yup'

export const editAddressSchema = yup.object({
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
