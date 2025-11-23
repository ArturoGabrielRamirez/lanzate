import { Check, Phone, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { Button } from "@/features/shadcn/components/button";
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
/* import { CreateStoreFormValues } from "@/features/stores/types" */

export function ContactFormPanel() {
    const t = useTranslations("store.create-form.contact")
    const { control, formState: { isValid }, setValue, getValues } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const { fields, append, remove } = useFieldArray({ control, name: "contact_info.phones" })
    const { contact_info } = values

    const [isAddingPhone, setIsAddingPhone] = useState(false)
    const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (contact_info) {
            setValue("contact_info", contact_info)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setStepValid(3, isValid)
    }, [isValid, setStepValid])

    const handleAddPhone = () => {
        append({ phone: "", is_primary: fields.length === 0 })
        setIsAddingPhone(true)
    }

    const handleRemovePhone = (index: number) => {
        remove(index)
        setIsAddingPhone(false)
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

    const handlePhoneChange = (index: number, value: string) => {
        const currentPhones = getValues("contact_info.phones") || []

        const updatedPhones = currentPhones.map((item: { phone: string; is_primary: boolean }, i: number) => {
            if (i === index) return { ...item, phone: value }
            return item
        })

        setCtxValues({
            contact_info: {
                ...values.contact_info,
                phones: updatedPhones
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{t("phone")}</label>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                        <InputField
                            startIcon={<Phone />}
                            name={`contact_info.phones.${index}.phone`}
                            label=""
                            placeholder={t("phone-placeholder")}
                            hideLabel
                            onChange={(e) => handlePhoneChange(index, e.target.value)}
                        />
                        <Button type="button" size="lg" variant="destructive" onClick={() => handleRemovePhone(index)} >
                            <Trash2 />
                        </Button>
                        {!confirmedIds.has(field.id) && (
                            <Button type="button" size="lg" variant="outline" onClick={() => handleConfirmPhone(index)} >
                                <Check />
                            </Button>
                        )}
                    </div>
                ))}

                {!isAddingPhone && (
                    <Button type="button" variant="outline" onClick={handleAddPhone} >
                        <Plus />
                        Agregar teléfono
                    </Button>
                )}


            </div>
        </div>
    )
}
