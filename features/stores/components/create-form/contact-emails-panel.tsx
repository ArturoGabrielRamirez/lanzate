import { Check, Mail, Plus, Star, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { Button } from "@/features/shadcn/components/button";
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button";
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"

export function ContactEmailsPanel() {
    const t = useTranslations("store.create-form.contact")
    const { control, formState: { errors }, setValue, getValues, trigger, watch } = useFormContext()
    const { values, setValues: setCtxValues } = useCreateStoreContext()
    const { fields, append, remove } = useFieldArray({ control, name: "contact_info.emails" })
    const { contact_info } = values

    const [isAddingEmail, setIsAddingEmail] = useState(false)
    const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set())

    const emails = watch("contact_info.emails")

    useEffect(() => {
        if (contact_info?.emails) {
            setValue("contact_info.emails", contact_info.emails)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (fields.length > 0 && confirmedIds.size === 0) {
            const newConfirmed = new Set<string>()
            const currentEmails = getValues("contact_info.emails") || []

            fields.forEach((field, index) => {
                const emailData = currentEmails[index];
                if (emailData && emailData.email) {
                    newConfirmed.add(field.id)
                }
            })

            if (newConfirmed.size > 0) {
                setConfirmedIds(newConfirmed)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields.length])

    const handleAddEmail = () => {
        append({ email: "", is_primary: fields.length === 0 })
        setIsAddingEmail(true)
        trigger("contact_info.emails")
    }

    const handleRemoveEmail = (index: number) => {
        remove(index)
        setIsAddingEmail(false)

        const currentEmails = getValues("contact_info.emails") || []
        const updatedEmails = currentEmails.filter((_: { email: string; is_primary: boolean }, i: number) => i !== index)

        setCtxValues({
            contact_info: {
                ...values.contact_info,
                emails: updatedEmails
            }
        })
    }

    const handleConfirmEmail = (index: number) => {
        const field = fields[index]
        if (field && field.id) {
            setConfirmedIds(prev => {
                const next = new Set(prev)
                next.add(field.id)
                return next
            })
        }
        setIsAddingEmail(false)
    }

    const handleSetPrimary = (index: number) => {
        const currentEmails = getValues("contact_info.emails") || []

        const updatedEmails = currentEmails.map((item: { email: string; is_primary: boolean }, i: number) => ({
            ...item,
            is_primary: i === index
        }))

        setValue("contact_info.emails", updatedEmails)

        setCtxValues({
            contact_info: {
                ...values.contact_info,
                emails: updatedEmails
            }
        })
    }

    const handleEmailChange = (index: number, value: string) => {
        const currentEmails = getValues("contact_info.emails") || []

        const updatedEmails = currentEmails.map((item: { email: string; is_primary: boolean }, i: number) => {
            if (i === index) return { ...item, email: value }
            return item
        })

        setCtxValues({
            contact_info: {
                ...values.contact_info,
                emails: updatedEmails
            }
        })
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t("email")}</label>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                    <InputField
                        startIcon={<Mail />}
                        name={`contact_info.emails.${index}.email`}
                        label=""
                        placeholder={t("email-placeholder")}
                        hideLabel
                        disabled={confirmedIds.has(field.id) || (!!emails?.[index]?.email && emails?.[index]?.email.length > 0 && !isAddingEmail)}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        endIcon={
                            <div className="flex">
                                <IconButton
                                    icon={Star}
                                    onClick={() => handleSetPrimary(index)}
                                    color={emails?.[index]?.is_primary ? [255, 215, 0] : [80, 40, 0]}
                                    iconClassName={emails?.[index]?.is_primary ? "text-yellow-500 fill-yellow-500" : "text-yellow-500"}
                                    tooltip={"Marcar como principal"}
                                />
                                <IconButton
                                    icon={Trash2}
                                    onClick={() => handleRemoveEmail(index)}
                                    color={[255, 0, 0]}
                                    iconClassName="text-red-500"
                                    tooltip={"Eliminar"}
                                />
                                {(!confirmedIds.has(field.id) && (!emails?.[index]?.email || (isAddingEmail && index === fields.length - 1))) && (
                                    <IconButton
                                        icon={Check}
                                        onClick={() => handleConfirmEmail(index)}
                                        color={[0, 200, 0]}
                                        iconClassName="text-green-500"
                                        tooltip={"Confirmar"}
                                        disabled={!!(errors?.contact_info as unknown as { emails: { email: string }[] })?.emails?.[index]?.email}
                                    />
                                )}
                            </div>
                        }
                    />

                </div>
            ))}

            {!isAddingEmail && (
                <Button type="button" variant="outline" onClick={handleAddEmail} >
                    <Plus />
                    Agregar nuevo
                </Button>
            )}
        </div>
    )
}

