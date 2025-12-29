import * as yup from 'yup'

const name = yup.string().required('El nombre es obligatorio').min(3, 'El nombre debe tener al menos 3 caracteres').max(50, 'El nombre debe tener menos de 50 caracteres').matches(/^[a-zA-Z0-9\s]+$/, 'El nombre solo puede contener letras, números y espacios')

const description = yup.string().max(255, 'La descripción debe tener menos de 255 caracteres')

const subdomain = yup.string().required('El subdominio es obligatorio').min(3, 'El subdominio debe tener al menos 3 caracteres').max(50, 'El subdominio debe tener menos de 50 caracteres').matches(/^[a-zA-Z\.]+$/, 'El subdominio solo puede contener letras')
const contact_phone = yup.string().max(20, 'El número de teléfono debe tener menos de 20 caracteres').matches(/^[0-9+\-\s\(\)]*$/, 'El número de teléfono solo puede contener números, espacios y símbolos telefónicos')

const contact_email = yup.string().email('Debe ser un correo electrónico válido').max(255, 'El correo electrónico debe tener menos de 255 caracteres')

const facebook_url = yup.string().url('Debe ser una URL válida').max(255, 'La URL de Facebook debe tener menos de 255 caracteres')

const instagram_url = yup.string().url('Debe ser una URL válida').max(255, 'La URL de Instagram debe tener menos de 255 caracteres')

const x_url = yup.string().url('Debe ser una URL válida').max(255, 'La URL de X debe tener menos de 255 caracteres')
const is_physical_store = yup.boolean()

const address = yup.string().when('is_physical_store', {
    is: true,
    then: (schema) => schema.required('La dirección es obligatoria cuando la tienda es física').max(255, 'La dirección debe tener menos de 255 caracteres'),
    otherwise: (schema) => schema.max(255, 'La dirección debe tener menos de 255 caracteres')
})

const city = yup.string().when('is_physical_store', {
    is: true,
    then: (schema) => schema.required('La ciudad es obligatoria cuando la tienda es física').max(100, 'La ciudad debe tener menos de 100 caracteres'),
    otherwise: (schema) => schema.max(100, 'La ciudad debe tener menos de 100 caracteres')
})

const province = yup.string().when('is_physical_store', {
    is: true,
    then: (schema) => schema.required('La provincia es obligatoria cuando la tienda es física').max(100, 'La provincia debe tener menos de 100 caracteres'),
    otherwise: (schema) => schema.max(100, 'La provincia debe tener menos de 100 caracteres')
})

const country = yup.string().when('is_physical_store', {
    is: true,
    then: (schema) => schema.required('El país es obligatorio cuando la tienda es física').max(100, 'El país debe tener menos de 100 caracteres'),
    otherwise: (schema) => schema.max(100, 'El país debe tener menos de 100 caracteres')
})


export const schema = yup.object({
    name,
    description,
    subdomain,
    is_physical_store,
    address,
    city,
    province,
    country,
    contact_phone,
    contact_email,
    facebook_url,
    instagram_url,
    x_url,
})

export const editSchema = yup.object({
    name,
    description,
    subdomain,
    contact_phone,
    contact_email,
    facebook_url,
    instagram_url,
    x_url,
    is_physical_store,
    address,
    city,
    province,
    country,
})
