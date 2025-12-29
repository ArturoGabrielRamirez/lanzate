/* import * as Yup from 'yup'

import { passwordSchema } from '@/features/auth/schemas'

export const newPasswordSchema = Yup.object({
  password: passwordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Confirmar contraseña es requerido')
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
})
 */