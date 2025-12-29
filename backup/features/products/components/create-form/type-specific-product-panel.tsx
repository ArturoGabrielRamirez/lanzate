"use client"

import { Box, CloudDownload, Wrench } from "lucide-react"
import { useCallback, useEffect } from "react"
import { Selection } from "react-aria-components"
import { useFormContext } from "react-hook-form"

import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { DigitalPanel } from "@/features/products/components/create-form/digital-panel"
import { FisicalPanel } from "@/features/products/components/create-form/fisical-panel"
import { ServicePanel } from "@/features/products/components/create-form/service-panel"
import { CreateProductFormType, ProductType } from "@/features/products/schemas/create-product-form-schema"
import { ChoiceBox, ChoiceBoxItem, ChoiceBoxLabel, ChoiceBoxDescription } from "@/features/shadcn/components/ui/choice-box"
import { Label } from "@/features/shadcn/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"

export function TypeSpecificProductPanel() {
    const { setValue } = useFormContext<CreateProductFormType>()
    const { values, setValues, setStepValid } = useCreateProductContext()
    const productType = values.basic_info?.type || ProductType.PHYSICAL

    // Sync type with form on mount
    useEffect(() => {
        setValue("basic_info.type", productType)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleTypeChange = useCallback((keys: Selection) => {
        const selected = Array.from(keys)[0] as ProductType
        if (selected) {
            setValues({ ...values, basic_info: { ...values.basic_info, type: selected } })
            setValue("basic_info.type", selected, { shouldValidate: true, shouldDirty: true })
        }
    }, [setValues, setValue, values])

    // Validate step - for now always valid since we only show Empty components
    useEffect(() => {
        setStepValid(4, true)
    }, [setStepValid])

    // Render the appropriate panel based on product type
    const renderPanel = () => {
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

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium">Tipo de Producto</Label>
                <ChoiceBox
                    columns={3}
                    gap={4}
                    selectedKeys={productType ? [productType] : []}
                    onSelectionChange={handleTypeChange}
                    selectionMode="single"
                >
                    <ChoiceBoxItem id={ProductType.PHYSICAL} textValue="Físico">
                        <Box />
                        <ChoiceBoxLabel>Físico</ChoiceBoxLabel>
                        <ChoiceBoxDescription>Producto tangible que requiere envío.</ChoiceBoxDescription>
                    </ChoiceBoxItem>
                    <ChoiceBoxItem id={ProductType.DIGITAL} textValue="Digital">
                        <CloudDownload />
                        <ChoiceBoxLabel>Digital</ChoiceBoxLabel>
                        <ChoiceBoxDescription>Archivo o contenido descargable.</ChoiceBoxDescription>
                    </ChoiceBoxItem>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ChoiceBoxItem id={ProductType.SERVICE} textValue="Servicio" isDisabled>
                                <Wrench />
                                <ChoiceBoxLabel>Servicio</ChoiceBoxLabel>
                                <ChoiceBoxDescription>Servicio profesional o consultoría.</ChoiceBoxDescription>
                            </ChoiceBoxItem>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Servicio no disponible. Próximamente.</p>
                        </TooltipContent>
                    </Tooltip>
                </ChoiceBox>
            </div>

            {renderPanel()}
        </div>
    )
}

