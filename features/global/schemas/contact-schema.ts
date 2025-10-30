import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const contactSchema = yup.object({
    category: yup.string().required("Seleccione una categoría"),
    name: yup.string().required("El nombre es requerido"),
    email: yup.string().email("Dirección de correo inválida").required("El email es requerido"),
    message: yup.string().min(10, "El mensaje es muy corto").required("El mensaje es requerido"),
});

export type ContactFormData = yup.InferType<typeof contactSchema>;

export const contactResolver = yupResolver(contactSchema);