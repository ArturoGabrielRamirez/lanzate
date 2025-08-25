"use client"

import { Phone, Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { ButtonWithPopup } from "@/features/layout/components"
import { InputField } from "@/features/layout/components"
import { editContactSchema } from "../../schemas/contact-schema"
import { updateStoreContact } from "../../actions/updateStoreContact"
import { Store, Branch } from "@prisma/client"

interface EditContactButtonProps {
    store: Store & { branches: Branch[] }
    className?: string
}

const EditContactButton = ({ store, className }: EditContactButtonProps) => {
    const t = useTranslations("store.edit-store")
    const mainBranch = store.branches?.[0]

    const handleEditContact = async (payload: { contact_phone: string; contact_email: string }) => {
        return updateStoreContact(store.id, payload)
    }

    const messages = {
        success: t("contact-updated-success"),
        error: t("contact-updated-error"),
        loading: t("contact-updating")
    }

    return (
        <ButtonWithPopup
            text={
                <>
                    <Phone className="size-4" />
                    {t("edit-contact")}
                </>
            }
            title={t("edit-contact-title")}
            description={t("edit-contact-description")}
            schema={editContactSchema}
            action={handleEditContact}
            messages={messages}
            className={className}
        >
            <div className="space-y-4">
                <InputField
                    name="contact_phone"
                    label={t("contact-phone")}
                    placeholder={t("contact-phone-placeholder")}
                    defaultValue={mainBranch?.phone || ""}
                    icon={<Phone className="size-4" />}
                />
                <InputField
                    name="contact_email"
                    label="Email"
                    placeholder={t("contact-email-placeholder")}
                    defaultValue={mainBranch?.email || ""}
                    icon={<Mail className="size-4" />}
                    type="email"
                />
            </div>
        </ButtonWithPopup>
    )
}

export default EditContactButton
