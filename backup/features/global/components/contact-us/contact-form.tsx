'use client'

import { ListIcon, MailIcon, UserIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Form } from "@/features/global/components/form/form"
import { InputField } from "@/features/global/components/form/input-field"
import { SelectField } from "@/features/global/components/form/select-field"
import { TextareaField } from "@/features/global/components/form/textarea-field"
import { contactResolver, ContactFormData } from "@/features/global/schemas/contact-schema"
import { ContactFormProps } from "@/features/global/types"

export function ContactForm({ onSuccess }: ContactFormProps) {
    const t = useTranslations("auth.contact.form");
    const [formKey, setFormKey] = useState(0);

    const categories = [
        { value: "technical", label: t("categories.technical") },
        { value: "products", label: t("categories.products") },
        { value: "ecommerce", label: t("categories.ecommerce") },
        { value: "subdomain", label: t("categories.subdomain") },
        { value: "billing", label: t("categories.billing") },
        { value: "integrations", label: t("categories.integrations") },
        { value: "general", label: t("categories.general") },
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
                message: responseData.error || t("messages.error"),
                payload: null,
                hasError: true
            };
        }

        // Forzar reset del formulario cambiando la key
        setFormKey(prev => prev + 1);

        if (onSuccess) onSuccess();

        return {
            error: false,
            message: t("messages.success"),
            payload: responseData.data,
            hasError: false
        };
    };

    return (
        <Form<ContactFormData>
            key={formKey}
            resolver={contactResolver}
            formAction={handleSubmit}
            contentButton={t("actions.submit")}
            successMessage={t("messages.successShort")}
            loadingMessage={t("messages.loading")}
            className="!bg-transparent !border-none !shadow-none !p-0 !rounded-none"
            onSuccess={onSuccess}
            resetOnSuccess={true}
        >
            <InputField
                type="text"
                name="name"
                label={t("fields.name.label")}
                placeholder={t("fields.name.placeholder")}
                tooltip={t("fields.name.tooltip")}
                isRequired
                startIcon={<UserIcon />}
            />

            <InputField
                type="email"
                name="email"
                label={t("fields.email.label")}
                placeholder={t("fields.email.placeholder")}
                isRequired
                tooltip={t("fields.email.tooltip")}
                startIcon={<MailIcon />}
            />

            <SelectField
                name="category"
                label={t("fields.category.label")}
                placeholder={t("fields.category.placeholder")}
                options={categories}
                isRequired
                tooltip={t("fields.category.tooltip")}
                startIcon={<ListIcon />}
            />

            <TextareaField
                name="message"
                label={t("fields.message.label")}
                placeholder={t("fields.message.placeholder")}
                isRequired
                tooltip={t("fields.message.tooltip")}
            />
        </Form>
    );
}