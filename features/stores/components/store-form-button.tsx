"use client"

import { ButtonWithPopup, InputField, CheckboxField } from "@/features/layout/components"
import { generate } from "random-words"
import { Plus, Pencil, Phone, MessageCircle, MapPin, Store as StoreIcon } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import AccordionTriggerWithValidation from "@/features/branches/components/accordion-trigger-with-validation"
import { cn } from "@/lib/utils"
import { Store, StoreOperationalSettings, Branch } from "@prisma/client"
import * as yup from 'yup'
import { ResponseType } from "@/features/layout/types"


type StoreFormData = {
    name: string
    description?: string
    subdomain: string
    contact_phone?: string
    contact_whatsapp?: string
    facebook_url?: string
    instagram_url?: string
    x_url?: string
    is_physical_store?: boolean
    address?: string
    city?: string
    province?: string
    country?: string
}

type StoreFormButtonProps = {
    mode: 'create' | 'edit'
    userId: number
    schema: yup.ObjectSchema<Record<string, unknown>>
    action: (payload: StoreFormData) => Promise<ResponseType<unknown>>
    messages: {
        success: string
        error: string
        loading: string
    }
    // Props específicas para crear
    canCreate?: boolean
    className?: string
    // Props específicas para editar
    slug?: string
    store?: Store & {
        operational_settings: StoreOperationalSettings | null
        branches: Branch[]
    }
    isEdit?: boolean
}

function StoreFormButton({
    mode,
    schema,
    action,
    messages,
    canCreate = true,
    className,
    store,
    isEdit = false
}: StoreFormButtonProps) {

    const [subdomain, setSubdomain] = useState(
        mode === 'create'
            ? generate({ exactly: 1, minLength: 7, join: "" })
            : store?.subdomain || ""
    )

    const [isPhysicalStore, setIsPhysicalStore] = useState(store?.is_physical_store || false)

    const t = useTranslations(mode === 'create' ? "store.create-store" : "store.edit-store")

    const handleSubmit = async (payload: StoreFormData) => {
        const formData = {
            ...payload,
            subdomain,
        }

        return action(formData)
    }

    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubdomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))
    }

    const buttonText = mode === 'create' ? (
        <>
            <Plus />
            {t("button")}
        </>
    ) : (
        <>
            <Pencil />
            {t("button")}
        </>
    )

    return (
        <ButtonWithPopup
            text={buttonText}
            title={t("title")}
            disabled={mode === 'create' ? !canCreate : false}
            schema={schema}
            description={t("description")}
            action={handleSubmit}
            messages={messages}
            className={cn("w-full", className)}
        >
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTriggerWithValidation keys={["name", "description", "subdomain"]}>
                        <span className="flex items-center gap-2">
                            <StoreIcon className="size-4" />
                            Basic info
                        </span>
                    </AccordionTriggerWithValidation>
                    <AccordionContent className="space-y-4">
                        <InputField
                            name="name"
                            label={t("name")}
                            type="text"
                            defaultValue={store?.name}
                        />
                        <InputField
                            name="description"
                            label={t("description-field")}
                            type="text"
                            defaultValue={store?.description || ""}
                        />
                        <div className="relative grid grid-cols-[1fr_auto] gap-2 items-end">
                            <InputField
                                name="subdomain"
                                label={t("subdomain")}
                                type="text"
                                onChange={handleSubdomainChange}
                                value={subdomain}
                            />
                            <span className="text-muted-foreground pointer-events-none select-none">
                                .lanzate.com
                            </span>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTriggerWithValidation keys={["is_physical_store", "address", "city", "province", "country"]}>
                        <span className="flex items-center gap-2">
                            <MapPin className="size-4" />
                            {t("address-section")}
                        </span>
                    </AccordionTriggerWithValidation>
                    <AccordionContent className="space-y-4">
                        <CheckboxField
                            name="is_physical_store"
                            label={t("is-physical-store")}
                            defaultValue={isPhysicalStore}
                            onChange={(checked) => {
                                setIsPhysicalStore(checked)
                            }}
                        />
                        <InputField
                            name="address"
                            label={t("address")}
                            type="text"
                            defaultValue={store?.branches?.[0]?.address || ""}
                            disabled={!isPhysicalStore}
                        />
                        <InputField
                            name="city"
                            label={t("city")}
                            type="text"
                            defaultValue={store?.branches?.[0]?.city || ""}
                            disabled={!isPhysicalStore}
                        />
                        <InputField
                            name="province"
                            label={t("province")}
                            type="text"
                            defaultValue={store?.branches?.[0]?.province || ""}
                            disabled={!isPhysicalStore}
                        />
                        <InputField
                            name="country"
                            label={t("country")}
                            type="text"
                            defaultValue={store?.branches?.[0]?.country || ""}
                            disabled={!isPhysicalStore}
                        />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTriggerWithValidation keys={["contact_phone", "contact_email"]}>
                        <span className="flex items-center gap-2">
                            <Phone className="size-4" />
                            {t("contact-section")}
                        </span>
                    </AccordionTriggerWithValidation>
                    <AccordionContent className="space-y-4">
                        <InputField
                            name="contact_phone"
                            label={t("contact-phone")}
                            type="tel"
                            defaultValue={isEdit ? store?.branches[0]?.phone || "" : ""}
                        />
                        <InputField
                            name="contact_email"
                            label={"Email"}
                            type="email"
                            defaultValue={isEdit ? store?.branches[0]?.email || "" : ""}
                        />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTriggerWithValidation keys={["facebook_url", "instagram_url", "x_url"]}>
                        <span className="flex items-center gap-2">
                            <MessageCircle className="size-4" />
                            {t("social-media-section")}
                        </span>
                    </AccordionTriggerWithValidation>
                    <AccordionContent className="space-y-4">
                        <InputField
                            name="facebook_url"
                            label={t("facebook-url")}
                            type="url"
                            defaultValue={store?.operational_settings?.facebook_url || ""}
                        />
                        <InputField
                            name="instagram_url"
                            label={t("instagram-url")}
                            type="url"
                            defaultValue={store?.operational_settings?.instagram_url || ""}
                        />
                        <InputField
                            name="x_url"
                            label={t("x-url")}
                            type="url"
                            defaultValue={store?.operational_settings?.x_url || ""}
                        />
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </ButtonWithPopup>
    )
}

export default StoreFormButton
