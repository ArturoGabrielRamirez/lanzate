"use client"

import { BranchPaymentConfig } from "@prisma/client"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { PaymentMethodsFormPanel } from "@/features/stores/components/create-form/payment-methods-form-panel"
import { CreateStoreFormType } from "@/features/stores/schemas"
import { reverseMapPaymentMethodType } from "@/features/stores/utils/payment-helpers"

type PaymentMethodsClientWrapperProps = {
    data: BranchPaymentConfig[]
}

type PaymentMethodType = NonNullable<CreateStoreFormType["payment_info"]["payment_methods"]>[number]["type"]

export function PaymentMethodsClientWrapper({ data }: PaymentMethodsClientWrapperProps) {

    const { setValues, values } = useCreateStoreContext()
    const { setValue } = useFormContext()

    useEffect(() => {
        if (data) {
            const mappedMethods = data.map(method => {
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
        }
    }, [])

    return (
        <PaymentMethodsFormPanel />
    )
}

