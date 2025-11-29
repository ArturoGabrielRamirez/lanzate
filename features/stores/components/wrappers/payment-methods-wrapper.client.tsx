"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { BranchPaymentConfig } from "@prisma/client"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Form } from "@/features/global/components/form/form"
import { updateStorePaymentMethodsAction } from "@/features/stores/actions/update-store-payment-methods.action"
import { PaymentMethodsClientWrapper } from "@/features/stores/components/wrappers/payment-methods-client-wrapper"
import { PaymentMethodsFormActions } from "@/features/stores/components/wrappers/payment-methods-form-actions"
import { paymentSchema, PaymentFormType } from "@/features/stores/schemas"

type PaymentMethodsFormWrapperProps = {
    data: BranchPaymentConfig[]
    slug?: string | null
}

export function PaymentMethodsFormWrapper({ data, slug }: PaymentMethodsFormWrapperProps) {

    const [isEditing, setIsEditing] = useState(false)
    const [transition, startTransition] = useTransition()

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = (formData: PaymentFormType) => {

        if (!slug) {
            toast.error("No se puede guardar la información sin un slug")
            return
        }

        toast.loading("Guardando métodos de pago...")

        startTransition(async () => {

            const { hasError, message } = await updateStorePaymentMethodsAction(slug, formData)

            toast.dismiss()

            if (hasError) {
                toast.error(message)
            } else {
                toast.success(message)
                setIsEditing(false)
            }

        })
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    return (
        <Form<PaymentFormType>
            contentButton="Guardar"
            resolver={yupResolver(paymentSchema as never)}
            submitButtonClassName="self-end w-fit"
            submitButton={false}
            disabled={!isEditing}
            formAction={async () => {
                return {
                    hasError: false,
                    message: "Métodos de pago actualizados con éxito!",
                    payload: null
                }
            }}
        >
            <PaymentMethodsClientWrapper data={data} />
            <PaymentMethodsFormActions
                isEditing={isEditing}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onSave={handleSave}
                isSaving={transition}
                initialValues={data}
            />
        </Form>
    )
}

