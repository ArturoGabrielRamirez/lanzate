"use client"

import { BranchShippingMethod } from "@prisma/client"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { ShippingFormPanel } from "@/features/stores/components/create-form/shipping-form-panel"
import { reverseMapShippingMethods } from "@/features/stores/utils/shipping-helpers"

type ShippingClientWrapperProps = {
    data: BranchShippingMethod[]
}

export function ShippingClientWrapper({ data }: ShippingClientWrapperProps) {

    const { setValues, values } = useCreateStoreContext()
    const { setValue } = useFormContext()

    useEffect(() => {
        if (data) {
            const mappedMethods = reverseMapShippingMethods(data)

            if (!mappedMethods) return

            const offersDelivery = mappedMethods.length > 0

            setValues({
                ...values,
                shipping_info: {
                    offers_delivery: offersDelivery,
                    methods: mappedMethods
                }
            })

            setValue("shipping_info.offers_delivery", offersDelivery)
            setValue("shipping_info.methods", mappedMethods)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ShippingFormPanel />
    )
}

