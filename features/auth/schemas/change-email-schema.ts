import * as Yup from "yup"

export const changeEmailSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required("La contraseña actual es requerida para cambiar el email"),
    email: Yup.string()
        .email("Debe ser un email válido")
        .notOneOf([Yup.ref('currentPassword')], "El nuevo email no puede ser el mismo que el actual")
        .required("El nuevo email es requerido")
});