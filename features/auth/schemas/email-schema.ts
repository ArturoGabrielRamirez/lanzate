import * as yup from 'yup'

export const emailSchema = yup.object({
    email: yup.string().email('Debe ser un email válido').required('El email es requerido'),
})