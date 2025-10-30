
import * as Yup from 'yup'

export const passwordSchema = Yup.string()
  .min(6, "La contraseña debe tener al menos 6 caracteres")
  .required("La contraseña es requerida")
  .matches(/[A-Z]/, "Debe contener al menos una mayúscula")
  .matches(/[a-z]/, "Debe contener al menos una minúscula")
  .matches(/[0-9]/, "Debe contener al menos un número")
