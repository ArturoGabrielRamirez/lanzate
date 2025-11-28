"use client"

import { BranchPaymentConfig } from "@prisma/client"
import { CheckIcon, Loader2 } from "lucide-react"
import { useFormContext } from "react-hook-form"

import { Button } from "@/features/shadcn/components/button"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { CreateStoreFormType, PaymentFormType } from "@/features/stores/schemas"
import { reverseMapPaymentMethodType } from "@/features/stores/utils/payment-helpers"

type PaymentMethodType = NonNullable<CreateStoreFormType["payment_info"]["payment_methods"]>[number]["type"]

type PaymentMethodsFormActionsProps = {
    isEditing: boolean
    onEdit: () => void
    onCancel: () => void
    onSave: (data: PaymentFormType) => void
    isSaving: boolean
    initialValues: BranchPaymentConfig[]
}

export function PaymentMethodsFormActions({ isEditing, onEdit, onCancel, onSave, isSaving, initialValues }: PaymentMethodsFormActionsProps) {

    const { formState: { isValid }, setValue, handleSubmit } = useFormContext<PaymentFormType>()
    const { values, setValues } = useCreateStoreContext()

    const handleCancel = () => {

        const mappedMethods = initialValues.map(method => {
            const details = method.details as { cbu?: string, alias?: string, instructions?: string } || {}
            return {
                name: method.name,
                type: reverseMapPaymentMethodType(method.type) as PaymentMethodType,
                commission_percent: method.commission_percent || 0,
                commission_amount: method.commission_amount || 0,
                cbu_cvu: details.cbu || "",
                alias: details.alias || "",
                instructions: details.instructions || ""
            }
        })

        setValues({
            ...values,
            payment_info: {
                payment_methods: mappedMethods
            }
        })

        setValue("payment_info.payment_methods", mappedMethods)

        onCancel()
    }

    return (
        <div className="flex justify-end gap-2 mt-4">
            {!isEditing && (
                <Button variant={"outline"} onClick={onEdit} type="button">Editar</Button>
            )}
            {isEditing && (
                <Button onClick={handleCancel} variant="destructive" type="button">Cancelar</Button>
            )}
            {isEditing && (
                <Button onClick={handleSubmit(onSave)} type="button" disabled={isSaving || !isValid}>
                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : <CheckIcon className="size-4" />}
                    {isSaving ? "Guardando..." : "Guardar"}
                </Button>
            )}
        </div>
    )
}

