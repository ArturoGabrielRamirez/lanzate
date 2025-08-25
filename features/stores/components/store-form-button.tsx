"use client"

import { ButtonWithPopup } from "@/features/layout/components"
import { generate } from "random-words"
import { Plus, Pencil } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Accordion } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Store, StoreOperationalSettings, Branch } from "@prisma/client"
import * as yup from 'yup'
import { ResponseType } from "@/features/layout/types"
import { 
    BasicInfoSection, 
    AddressSection, 
    ContactSection, 
    SocialMediaSection 
} from "./form-sections"


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

}

function StoreFormButton({
    mode,
    schema,
    action,
    messages,
    canCreate = true,
    className,
    store
}: StoreFormButtonProps) {

    const [subdomain, setSubdomain] = useState(
        mode === 'create'
            ? generate({ exactly: 1, minLength: 7, join: "" })
            : store?.subdomain || ""
    )

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
                <BasicInfoSection
                    store={store}
                    subdomain={subdomain}
                    onSubdomainChange={handleSubdomainChange}
                    mode={mode}
                />
                <AddressSection
                    store={store}
                    mode={mode}
                />
                <ContactSection
                    store={store}
                    mode={mode}
                />
                <SocialMediaSection
                    store={store}
                    mode={mode}
                />
            </Accordion>
        </ButtonWithPopup>
    )
}

export default StoreFormButton
