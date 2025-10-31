'use client'

import { ListIcon, MailIcon, UserIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Form } from "@/features/global/components/form/form"
import { InputField } from "@/features/global/components/form/input-field"
import { SelectField } from "@/features/global/components/form/select-field"
import { TextareaField } from "@/features/global/components/form/textarea-field"
import { contactResolver, ContactFormData } from "@/features/global/schemas/contact-schema"
import { ContactFormProps } from "@/features/global/types"

export function ContactForm({ onSuccess }: ContactFormProps) {
    const t = useTranslations("dashboard.help");

    const categories = [
        { value: "technical", label: "Problema técnico" },
        { value: "products", label: "Gestión de productos" },
        { value: "ecommerce", label: "E-commerce y ventas" },
        { value: "subdomain", label: "Subdominios y dominio personalizado" },
        { value: "billing", label: "Cuenta y facturación" },
        { value: "integrations", label: "Integraciones" },
        { value: "general", label: "Consulta general" },
    ];

    const handleSubmit = async (data: ContactFormData) => {
        const res = await fetch("/api/help/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const responseData = await res.json();

        if (!res.ok) {
            return {
                error: true,
                message: responseData.error || t("dialog.messages.error"),
                payload: null,
                hasError: true
            };
        }

        if (onSuccess) onSuccess();

        return {
            error: false,
            message: "¡Mensaje enviado con éxito! Nuestro equipo se pondrá en contacto contigo pronto. Por lo general, respondemos en un plazo de 24-48 horas.",
            payload: responseData.data,
            hasError: false
        };
    };

    return (
        <Form<ContactFormData>
            resolver={contactResolver}
            formAction={handleSubmit}
            contentButton={t("send-message")}
            successMessage="¡Mensaje enviado con éxito! Nuestro equipo se pondrá en contacto contigo pronto."
            loadingMessage={t("dialog.messages.loading")}
            className="!bg-transparent !border-none !shadow-none !p-0 !rounded-none"
            onSuccess={onSuccess}
            resetOnSuccess={true}
        >
            <InputField
                type="text"
                name="name"
                label={t("dialog.name")}
                placeholder={t("dialog.name")}
                tooltip="Ingrese su nombre completo"
                isRequired
                startIcon={<UserIcon />}
            />

            <InputField
                type="email"
                name="email"
                label={t("dialog.email")}
                placeholder={t("dialog.email")}
                isRequired
                tooltip="Ingrese un email al que podamos contactarnos con usted"
                startIcon={<MailIcon />}
            />

            <SelectField
                name="category"
                label="Categoría"
                placeholder="Seleccione el tipo de consulta"
                options={categories}
                isRequired
                tooltip="Seleccione la categoría que mejor describa su consulta"
                startIcon={<ListIcon />}
            />

            <TextareaField
                name="message"
                label={t("dialog.message")}
                placeholder={t("dialog.message")}
                isRequired
                tooltip="¿En qué podemos ayudarlo?"
            />
        </Form>
    );
}