"use client"

import { useEffect } from "react"

import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { DigitalPanel } from "@/features/products/components/create-form/digital-panel"
import { FisicalPanel } from "@/features/products/components/create-form/fisical-panel"
import { ServicePanel } from "@/features/products/components/create-form/service-panel"
import { ProductType } from "@/features/products/schemas/create-product-form-schema"

export function TypeSpecificProductPanel() {
    const { values, setStepValid } = useCreateProductContext()
    const productType = values.basic_info?.type || ProductType.PHYSICAL

    // Validate step - for now always valid since we only show Empty components
    useEffect(() => {
        setStepValid(4, true)
    }, [setStepValid])

    // Render the appropriate panel based on product type
    switch (productType) {
        case ProductType.PHYSICAL:
            return <FisicalPanel />
        case ProductType.DIGITAL:
            return <DigitalPanel />
        case ProductType.SERVICE:
            return <ServicePanel />
        default:
            return <FisicalPanel />
    }
}

