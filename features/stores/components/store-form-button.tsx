"use client"

import { Plus, Pencil } from "lucide-react"
import { useTranslations } from "next-intl"
import { generate } from "random-words"
import { useState } from "react"

import { Accordion } from "@/features/shadcn/components/ui/accordion"
import { ButtonWithPopup } from "@/features/layout/components"
import { BasicInfoSection, AddressSection, ContactSection, SocialMediaSection, StoreLogoInlineEditor } from "@/features/stores/components"
import { StoreFormData, StoreFormButtonProps } from "@/features/stores/types"
import { cn } from "@/lib/utils"

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
    const [logoUrl, setLogoUrl] = useState<string | null>(store?.logo ?? null)
    const [name, setName] = useState(store?.name || "")

    const t = useTranslations(mode === 'create' ? "store.create-store" : "store.edit-store")

    const handleSubmit = async (payload: StoreFormData) => {
        const formData = {
            ...payload,
            subdomain,
            logo: logoUrl || undefined,
        }

        return action(formData)
    }

    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubdomain(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
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

    const currentLogo = store?.logo || null

    return (
        <ButtonWithPopup
            text={buttonText}
            title={t("title")}
            disabled={mode === 'create' ? !canCreate : false}
            schema={schema as never}
            description={t("description")}
            action={handleSubmit}
            messages={messages}
            className={cn("w-full max-h-[500px] overflow-y-auto", className)}
        >
            <div className="mb-4">
                <StoreLogoInlineEditor
                    currentLogo={logoUrl ?? currentLogo}
                    storeName={name}
                    onLogoUpdate={(url) => setLogoUrl(url)}
                />
            </div>
            <Accordion type="single" collapsible defaultValue="item-1">
                <BasicInfoSection
                    store={store}
                    subdomain={subdomain}
                    onSubdomainChange={handleSubdomainChange}
                    mode={mode}
                    onNameChange={handleNameChange}
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

export { StoreFormButton }
