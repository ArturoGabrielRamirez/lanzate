import { Check, Phone, Plus, Star, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { Button } from "@/features/shadcn/components/button";
import { Empty, EmptyDescription } from "@/features/shadcn/components/empty";
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button";
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"

export function ContactPhonesPanel() {
    const t = useTranslations("store.create-form.contact")
    const { control, formState: { errors }, setValue, getValues, trigger, watch } = useFormContext()
    const { values, setValues: setCtxValues } = useCreateStoreContext()
    const { fields, append, remove } = useFieldArray({ control, name: "contact_info.phones" })
    const { contact_info } = values

    const [isAddingPhone, setIsAddingPhone] = useState(false)
    const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set())

    const phones = watch("contact_info.phones")

    useEffect(() => {
        if (contact_info?.phones) {
            setValue("contact_info.phones", contact_info.phones)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (fields.length > 0 && confirmedIds.size === 0) {
            const newConfirmed = new Set<string>()
            const currentPhones = getValues("contact_info.phones") || []

            fields.forEach((field, index) => {
                const phoneData = currentPhones[index];
                if (phoneData && phoneData.phone) {
                    newConfirmed.add(field.id)
                }
            })

            if (newConfirmed.size > 0) {
                setConfirmedIds(newConfirmed)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields.length])

    const handleAddPhone = () => {
        append({ phone: "", is_primary: fields.length === 0 })
        setIsAddingPhone(true)
        trigger("contact_info.phones")
    }

    const handleRemovePhone = (index: number) => {
        remove(index)
        setIsAddingPhone(false)

        const currentPhones = getValues("contact_info.phones") || []
        const updatedPhones = currentPhones.filter((_: { phone: string; is_primary: boolean }, i: number) => i !== index)

        setCtxValues({
            ...values,
            contact_info: {
                ...values.contact_info,
                phones: updatedPhones
            }
        })
    }

    const handleConfirmPhone = (index: number) => {
        const field = fields[index]
        if (field && field.id) {
            setConfirmedIds(prev => {
                const next = new Set(prev)
                next.add(field.id)
                return next
            })
        }
        setIsAddingPhone(false)
    }

    const handleSetPrimary = (index: number) => {
        const currentPhones = getValues("contact_info.phones") || []

        const updatedPhones = currentPhones.map((item: { phone: string; is_primary: boolean }, i: number) => ({
            ...item,
            is_primary: i === index
        }))

        setValue("contact_info.phones", updatedPhones)

        setCtxValues({
            ...values,
            contact_info: {
                ...values.contact_info,
                phones: updatedPhones
            }
        })
    }

    const handlePhoneChange = (index: number, value: string) => {
        const currentPhones = getValues("contact_info.phones") || []

        const updatedPhones = currentPhones.map((item: { phone: string; is_primary: boolean }, i: number) => {
            if (i === index) return { ...item, phone: value }
            return item
        })

        setCtxValues({
            ...values,
            contact_info: {
                ...values.contact_info,
                phones: updatedPhones
            }
        })
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t("phone")}</label>
            </div>

            {fields.length === 0 && !isAddingPhone && (
                <Empty className="border-dashed border-muted-foreground/50 border !py-2">
                    <EmptyDescription className="!text-xs">
                        <p>No hay telefonos configurados</p>
                    </EmptyDescription>
                </Empty>
            )}

            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                    <InputField
                        startIcon={<Phone />}
                        name={`contact_info.phones.${index}.phone`}
                        label=""
                        placeholder={t("phone-placeholder")}
                        hideLabel
                        disabled={confirmedIds.has(field.id) || (!!phones?.[index]?.phone && phones?.[index]?.phone.length > 0 && !isAddingPhone)}
                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                        tooltip={"Un telefono de contacto de la tienda"}
                        endIcon={
                            <div className="flex">
                                <IconButton
                                    icon={Star}
                                    onClick={() => handleSetPrimary(index)}
                                    color={phones?.[index]?.is_primary ? [255, 215, 0] : [80, 40, 0]}
                                    iconClassName={phones?.[index]?.is_primary ? "text-yellow-500 fill-yellow-500" : "text-yellow-500"}
                                    tooltip={"Marcar como principal"}
                                />
                                <IconButton
                                    icon={Trash2}
                                    onClick={() => handleRemovePhone(index)}
                                    color={[255, 0, 0]}
                                    iconClassName="text-red-500"
                                    tooltip={"Eliminar"}
                                />
                                {(!confirmedIds.has(field.id) && (!phones?.[index]?.phone || (isAddingPhone && index === fields.length - 1))) && (
                                    <IconButton
                                        icon={Check}
                                        onClick={() => handleConfirmPhone(index)}
                                        color={[0, 200, 0]}
                                        iconClassName="text-green-500"
                                        tooltip={"Confirmar"}
                                        disabled={!!(errors?.contact_info as unknown as { phones: { phone: string }[] })?.phones?.[index]?.phone}
                                    />
                                )}
                            </div>
                        }
                    />
                </div>
            ))}

            {!isAddingPhone && (
                <Button type="button" variant="outline" onClick={handleAddPhone} >
                    <Plus />
                    Agregar nuevo
                </Button>
            )}
        </div>
    )
}

