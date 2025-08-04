import * as Yup from "yup";

export const passwordSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("La contraseña es requerida"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
        .required("Confirma tu contraseña")
}); 1