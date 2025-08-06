"use client"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { updateStore } from "../actions/updateStore"
import { editSchema } from "../schemas/store-schema"
import { formatErrorResponse } from "@/utils/lib"
import { Pencil, Phone, MessageCircle, User } from "lucide-react"
import { useState } from "react"
import { EditStoreButtonProps } from "@/features/stores/types"
import { useTranslations } from "next-intl"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

function EditStoreButton({ userId, slug, store }: EditStoreButtonProps) {

    const [subdomain, setSubdomain] = useState(store.subdomain)
    const t = useTranslations("store.edit-store")

    const handleEditStore = async (payload: any) => {
        if (!payload.name) return formatErrorResponse(t("messages.name-required"), null, null)
        if (!userId) return formatErrorResponse(t("messages.user-id-required"), null, null)
        return updateStore(slug, {
            ...payload,
            subdomain,
            // Incluir todos los campos de operational_settings
            // Usar strings vacíos en lugar de null para permitir borrar campos
            contact_phone: payload.contact_phone || "",
            contact_whatsapp: payload.contact_whatsapp || "",
            facebook_url: payload.facebook_url || "",
            instagram_url: payload.instagram_url || "",
            x_url: payload.x_url || "",
        }, userId)
    }

    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubdomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Pencil />
                    {t("button")}
                </>
            )}
            title={t("title")}
            schema={editSchema}
            description={t("description")}
            action={handleEditStore}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
        >
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <span className="flex items-center gap-2">
                            <User className="size-4" />
                            Basic info
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <InputField name="name" label={t("name")} type="text" defaultValue={store.name} />
                        <InputField name="description" label={t("description-field")} type="text" defaultValue={store.description || ""} />
                        <div className="relative grid grid-cols-[1fr_auto] gap-2 items-end">
                            <InputField name="subdomain" label={t("subdomain")} type="text" onChange={handleSubdomainChange} value={subdomain} />
                            <span className="text-muted-foreground pointer-events-none select-none">
                                .lanzate.com
                            </span>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>
                        <span className="flex items-center gap-2">
                            <Phone className="size-4" />
                            {t("contact-section")}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <InputField
                            name="contact_phone"
                            label={t("contact-phone")}
                            type="tel"
                            defaultValue={store.operational_settings?.contact_phone || ""}
                        />
                        <InputField
                            name="contact_whatsapp"
                            label={t("contact-whatsapp")}
                            type="tel"
                            defaultValue={store.operational_settings?.contact_whatsapp || ""}
                        />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>
                        <span className="flex items-center gap-2">
                            <MessageCircle className="size-4" />
                            {t("social-media-section")}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <InputField
                            name="facebook_url"
                            label={t("facebook-url")}
                            type="url"
                            defaultValue={store.operational_settings?.facebook_url || ""}
                        />
                        <InputField
                            name="instagram_url"
                            label={t("instagram-url")}
                            type="url"
                            defaultValue={store.operational_settings?.instagram_url || ""}
                        />
                        <InputField
                            name="x_url"
                            label={t("x-url")}
                            type="url"
                            defaultValue={store.operational_settings?.x_url || ""}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </ButtonWithPopup>
    )
}
export default EditStoreButton