import * as Yup from "yup";

export const emailSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required("La contraseña actual es requerida para cambiar el email"),
    email: Yup.string()
        .email("Debe ser un email válido")
        .required("El nuevo email es requerido")
});