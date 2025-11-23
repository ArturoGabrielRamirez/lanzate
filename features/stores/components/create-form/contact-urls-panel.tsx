import { Check, Link, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { Button } from "@/features/shadcn/components/button";
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"

export function ContactUrlsPanel() {
    const t = useTranslations("store.create-form.contact")
    const { control, formState: { errors }, setValue, getValues, trigger, watch } = useFormContext()
    const { values, setValues: setCtxValues } = useCreateStoreContext()
    const { fields, append, remove } = useFieldArray({ control, name: "contact_info.social_media" })
    const { contact_info } = values

    const [isAddingUrl, setIsAddingUrl] = useState(false)
    const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set())

    const urls = watch("contact_info.social_media")

    useEffect(() => {
        if (contact_info?.social_media) {
            setValue("contact_info.social_media", contact_info.social_media)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (fields.length > 0 && confirmedIds.size === 0) {
            const newConfirmed = new Set<string>()
            const currentUrls = getValues("contact_info.social_media") || []

            fields.forEach((field, index) => {
                const urlData = currentUrls[index];
                if (urlData && urlData.url) {
                    newConfirmed.add(field.id)
                }
            })

            if (newConfirmed.size > 0) {
                setConfirmedIds(newConfirmed)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields.length])

    const handleAddUrl = () => {
        append({ url: "", type: "other" })
        setIsAddingUrl(true)
        trigger("contact_info.social_media")
    }

    const handleRemoveUrl = (index: number) => {
        remove(index)
        setIsAddingUrl(false)

        const currentUrls = getValues("contact_info.social_media") || []
        const updatedUrls = currentUrls.filter((_: { url: string }, i: number) => i !== index)

        setCtxValues({
            contact_info: {
                ...values.contact_info,
                social_media: updatedUrls
            }
        })
    }

    const handleConfirmUrl = (index: number) => {
        const field = fields[index]
        if (field && field.id) {
            setConfirmedIds(prev => {
                const next = new Set(prev)
                next.add(field.id)
                return next
            })
        }
        setIsAddingUrl(false)
    }

    const handleUrlChange = (index: number, value: string) => {
        const currentUrls = getValues("contact_info.social_media") || []

        const updatedUrls = currentUrls.map((item: { url: string }, i: number) => {
            if (i === index) return { ...item, url: value }
            return item
        })

        setCtxValues({
            contact_info: {
                ...values.contact_info,
                social_media: updatedUrls
            }
        })
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t("social-media")}</label>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                    <InputField
                        startIcon={<Link />}
                        name={`contact_info.social_media.${index}.url`}
                        type="url"
                        inputMode="url"
                        label=""
                        placeholder="https://..."
                        hideLabel
                        disabled={confirmedIds.has(field.id) || (!!urls?.[index]?.url && urls?.[index]?.url.length > 0 && !isAddingUrl)}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                    />

                    <Button type="button" size="lg" variant="destructive" onClick={() => handleRemoveUrl(index)} >
                        <Trash2 />
                    </Button>
                    {(!confirmedIds.has(field.id) && (!urls?.[index]?.url || (isAddingUrl && index === fields.length - 1))) && (
                        <Button
                            type="button"
                            size="lg"
                            variant="outline"
                            onClick={() => handleConfirmUrl(index)}
                            disabled={!!(errors?.contact_info as unknown as { social_media: { url: string }[] })?.social_media?.[index]?.url}
                        >
                            <Check />
                        </Button>
                    )}
                </div>
            ))}

            {!isAddingUrl && (
                <Button type="button" variant="outline" onClick={handleAddUrl} >
                    <Plus />
                    Agregar enlace
                </Button>
            )}
        </div>
    )
}

