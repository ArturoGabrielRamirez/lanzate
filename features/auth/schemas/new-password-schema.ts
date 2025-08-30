import * as Yup from 'yup'


export const newPasswordSchema = Yup.object({
  password: Yup.string()
    .required('La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: Yup.string()
    .required('Confirmar contraseña es requerido')
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
})
