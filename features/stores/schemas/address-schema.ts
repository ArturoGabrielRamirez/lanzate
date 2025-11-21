import * as yup from 'yup'

export const editAddressSchema = yup.object({
    is_physical_store: yup.boolean(),
    address: yup.string().when('is_physical_store', {
        is: true,
        then: (schema) => schema.required('La dirección es obligatoria cuando la tienda es física').max(255, 'La dirección debe tener menos de 255 caracteres'),
        otherwise: (schema) => schema.max(255, 'La dirección debe tener menos de 255 caracteres')
    }),
    city: yup.string().when('is_physical_store', {
        is: true,
        then: (schema) => schema.required('La ciudad es obligatoria cuando la tienda es física').max(100, 'La ciudad debe tener menos de 100 caracteres'),
        otherwise: (schema) => schema.max(100, 'La ciudad debe tener menos de 100 caracteres')
    }),
    province: yup.string().when('is_physical_store', {
        is: true,
        then: (schema) => schema.required('La provincia es obligatoria cuando la tienda es física').max(100, 'La provincia debe tener menos de 100 caracteres'),
        otherwise: (schema) => schema.max(100, 'La provincia debe tener menos de 100 caracteres')
    }),
    country: yup.string().when('is_physical_store', {
        is: true,
        then: (schema) => schema.required('El país es obligatorio cuando la tienda es física').max(100, 'El país debe tener menos de 100 caracteres'),
        otherwise: (schema) => schema.max(100, 'El país debe tener menos de 100 caracteres')
    }),
})
