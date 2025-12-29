import * as Yup from "yup"

export const changeEmailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Debe ser un correo electrónico válido")
        .required("El correo electrónico es obligatorio")
});

export const changeEmailButtonSchema = Yup.object().shape({
    email: Yup.string()
        .email("Debe ser un correo electrónico válido")
        .required("El correo electrónico es obligatorio"),
    currentPassword: Yup.string()
        .required("La contraseña actual es obligatoria")
});