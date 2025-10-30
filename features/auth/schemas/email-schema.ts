import * as yup from 'yup'

export const emailSchema = yup.string().email('Debe ser un email válido').required('El email es requerido')