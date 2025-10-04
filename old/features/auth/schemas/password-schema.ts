
import * as Yup from 'yup'

// Schema base para contraseña
export const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Requerido'),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida")
    .matches(/[A-Z]/, "Debe contener al menos una mayúscula")
    .matches(/[a-z]/, "Debe contener al menos una minúscula")
    .matches(/[0-9]/, "Debe contener al menos un número"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    .required("Confirma tu contraseña") 
});

// Schema extendido con código de verificación
/* export const passwordWithVerificationSchema = Yup.object().shape({
  verificationCode: Yup.string()
    .min(6, 'El código debe tener al menos 6 caracteres')
    .max(6, 'El código debe tener exactamente 6 caracteres')
    .required('El código es requerido'),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida")
    .matches(/[A-Z]/, "Debe contener al menos una mayúscula")
    .matches(/[a-z]/, "Debe contener al menos una minúscula")
    .matches(/[0-9]/, "Debe contener al menos un número"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    .required("Confirma tu contraseña")
}); */