"use client"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { updateStore } from "../actions/updateStore"
import { editSchema } from "../schemas/store-schema"
import { formatErrorResponse } from "@/utils/lib"
import { Pencil, Phone, MessageCircle } from "lucide-react"
import { useState } from "react"
import { EditStoreButtonProps } from "@/features/stores/types"
import { useTranslations } from "next-intl"

function EditStoreButton({ userId, slug, store }: EditStoreButtonProps) {

    const [subdomain, setSubdomain] = useState(store.subdomain)
    const t = useTranslations("store.edit-store")

    const handleEditStore = async (payload: any) => {
        if (!payload.name) return formatErrorResponse(t("messages.name-required"), null, null)
        if (!userId) return formatErrorResponse(t("messages.user-id-required"), null, null)
        return updateStore(slug, { 
            ...payload, 
            subdomain,
            // Incluir los campos de operational_settings
            contact_phone: payload.contact_phone || null,
            contact_whatsapp: payload.contact_whatsapp || null,
            facebook_url: payload.facebook_url || null,
            instagram_url: payload.instagram_url || null,
            x_url: payload.x_url || null,
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
            <InputField name="name" label={t("name")} type="text" defaultValue={store.name} />
            <InputField name="description" label={t("description-field")} type="text" defaultValue={store.description || ""} />
            <div className="relative grid grid-cols-[1fr_auto] gap-2 items-end">
                <InputField name="subdomain" label={t("subdomain")} type="text" onChange={handleSubdomainChange} value={subdomain} />
                <span className="text-muted-foreground pointer-events-none select-none">
                    .lanzate.com
                </span>
            </div>

            {/* Sección de Contacto */}
            <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium flex items-center gap-2">
                    <Phone className="size-4" />
                    {t("contact-section")}
                </h4>
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
            </div>

            {/* Sección de Redes Sociales */}
            <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium flex items-center gap-2">
                    <MessageCircle className="size-4" />
                    {t("social-media-section")}
                </h4>
                <InputField 
                    name="facebook_url" 
                    label={t("facebook-url")} 
                    type="url" 
                    defaultValue={(store.operational_settings as any)?.facebook_url || ""} 
                />
                <InputField 
                    name="instagram_url" 
                    label={t("instagram-url")} 
                    type="url" 
                    defaultValue={(store.operational_settings as any)?.instagram_url || ""} 
                />
                <InputField 
                    name="x_url" 
                    label={t("x-url")} 
                    type="url" 
                    defaultValue={(store.operational_settings as any)?.x_url || ""} 
                />
            </div>
        </ButtonWithPopup>
    )
}
export default EditStoreButton