"use client"

// Icons removed as SelectInputField doesn't support startIcon yet
import { useCallback, useEffect, useMemo } from "react"
import { useFormContext } from "react-hook-form"

import { SelectInputField, SelectOption } from "@/features/global/components/form/select-input-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType, LengthUnit, WeightUnit } from "@/features/products/schemas/create-product-form-schema"

const weightUnitOptions: SelectOption[] = [
    { value: WeightUnit.KG, label: "KG" },
    { value: WeightUnit.G, label: "G" },
    { value: WeightUnit.LB, label: "LB" },
    { value: WeightUnit.OZ, label: "OZ" },
]

const lengthUnitOptions: SelectOption[] = [
    { value: LengthUnit.MM, label: "MM" },
    { value: LengthUnit.CM, label: "CM" },
    { value: LengthUnit.M, label: "M" },
    { value: LengthUnit.IN, label: "IN" },
    { value: LengthUnit.FT, label: "FT" },
]

export function FisicalPanel() {
    const { setValue, formState: { isValid, disabled } } = useFormContext<CreateProductFormType>()
    const { values, setValues, setStepValid } = useCreateProductContext()

    const physicalInfo = useMemo(() => values.type_specific_info?.physical || {
        weight: undefined,
        weight_unit: WeightUnit.KG,
        width: undefined,
        width_unit: LengthUnit.CM,
        height: undefined,
        height_unit: LengthUnit.CM,
        depth: undefined,
        depth_unit: LengthUnit.CM,
        diameter: undefined,
        diameter_unit: LengthUnit.CM,
    }, [values.type_specific_info?.physical])

    // Sync context with form state on mount
    useEffect(() => {
        setValue("type_specific_info.physical.weight", physicalInfo.weight || undefined)
        setValue("type_specific_info.physical.weight_unit", physicalInfo.weight_unit || WeightUnit.KG)
        setValue("type_specific_info.physical.width", physicalInfo.width || undefined)
        setValue("type_specific_info.physical.width_unit", physicalInfo.width_unit || LengthUnit.CM)
        setValue("type_specific_info.physical.height", physicalInfo.height || undefined)
        setValue("type_specific_info.physical.height_unit", physicalInfo.height_unit || LengthUnit.CM)
        setValue("type_specific_info.physical.depth", physicalInfo.depth || undefined)
        setValue("type_specific_info.physical.depth_unit", physicalInfo.depth_unit || LengthUnit.CM)
        setValue("type_specific_info.physical.diameter", physicalInfo.diameter || undefined)
        setValue("type_specific_info.physical.diameter_unit", physicalInfo.diameter_unit || LengthUnit.CM)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Validate step
    useEffect(() => {
        setStepValid(4, isValid)
    }, [isValid, setStepValid])

    const handleWeightChange = useCallback((value: string) => {
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                physical: {
                    ...physicalInfo,
                    weight_unit: value as WeightUnit,
                },
            },
        })
        setValue("type_specific_info.physical.weight_unit", value as WeightUnit, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, physicalInfo])

    const handleWeightInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const weight = e.target.value ? parseFloat(e.target.value) : undefined
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                physical: {
                    ...physicalInfo,
                    weight,
                },
            },
        })
        setValue("type_specific_info.physical.weight", weight, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, physicalInfo])

    const handleWidthChange = useCallback((value: string) => {
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                physical: {
                    ...physicalInfo,
                    width_unit: value as LengthUnit,
                },
            },
        })
        setValue("type_specific_info.physical.width_unit", value as LengthUnit, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, physicalInfo])

    const handleWidthInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const width = e.target.value ? parseFloat(e.target.value) : undefined
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                physical: {
                    ...physicalInfo,
                    width,
                },
            },
        })
        setValue("type_specific_info.physical.width", width, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, physicalInfo])

    const handleHeightChange = useCallback((value: string) => {
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                physical: {
                    ...physicalInfo,
                    height_unit: value as LengthUnit,
                },
            },
        })
        setValue("type_specific_info.physical.height_unit", value as LengthUnit, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, physicalInfo])

    const handleHeightInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const height = e.target.value ? parseFloat(e.target.value) : undefined
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                physical: {
                    ...physicalInfo,
                    height,
                },
            },
        })
        setValue("type_specific_info.physical.height", height, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, physicalInfo])

    const handleDepthChange = useCallback((value: string) => {
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                physical: {
                    ...physicalInfo,
                    depth_unit: value as LengthUnit,
                },
            },
        })
        setValue("type_specific_info.physical.depth_unit", value as LengthUnit, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, physicalInfo])

    const handleDepthInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const depth = e.target.value ? parseFloat(e.target.value) : undefined
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                physical: {
                    ...physicalInfo,
                    depth,
                },
            },
        })
        setValue("type_specific_info.physical.depth", depth, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, physicalInfo])

    const handleDiameterChange = useCallback((value: string) => {
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                physical: {
                    ...physicalInfo,
                    diameter_unit: value as LengthUnit,
                },
            },
        })
        setValue("type_specific_info.physical.diameter_unit", value as LengthUnit, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, physicalInfo])

    const handleDiameterInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const diameter = e.target.value ? parseFloat(e.target.value) : undefined
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                physical: {
                    ...physicalInfo,
                    diameter,
                },
            },
        })
        setValue("type_specific_info.physical.diameter", diameter, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, physicalInfo])

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInputField
                    selectName="type_specific_info.physical.weight_unit"
                    inputName="type_specific_info.physical.weight"
                    label="Peso"
                    selectOptions={weightUnitOptions}
                    selectPlaceholder="Unidad"
                    inputPlaceholder="0.00"
                    selectValue={physicalInfo.weight_unit}
                    inputValue={physicalInfo.weight?.toString()}
                    onSelectChange={handleWeightChange}
                    onInputChange={handleWeightInputChange}
                    tooltip="Peso del producto para cálculo de envío"
                    inputType="number"
                    inputMode="decimal"
                    inputPattern="[0-9]*\.?[0-9]*"
                    disabled={disabled}
                />

                <SelectInputField
                    selectName="type_specific_info.physical.width_unit"
                    inputName="type_specific_info.physical.width"
                    label="Ancho"
                    selectOptions={lengthUnitOptions}
                    selectPlaceholder="Unidad"
                    inputPlaceholder="0.00"
                    selectValue={physicalInfo.width_unit}
                    inputValue={physicalInfo.width?.toString()}
                    onSelectChange={handleWidthChange}
                    onInputChange={handleWidthInputChange}
                    tooltip="Ancho del producto"
                    inputType="number"
                    inputMode="decimal"
                    inputPattern="[0-9]*\.?[0-9]*"
                    disabled={disabled}
                />

                <SelectInputField
                    selectName="type_specific_info.physical.height_unit"
                    inputName="type_specific_info.physical.height"
                    label="Alto"
                    selectOptions={lengthUnitOptions}
                    selectPlaceholder="Unidad"
                    inputPlaceholder="0.00"
                    selectValue={physicalInfo.height_unit}
                    inputValue={physicalInfo.height?.toString()}
                    onSelectChange={handleHeightChange}
                    onInputChange={handleHeightInputChange}
                    tooltip="Altura del producto"
                    inputType="number"
                    inputMode="decimal"
                    inputPattern="[0-9]*\.?[0-9]*"
                    disabled={disabled}
                />

                <SelectInputField
                    selectName="type_specific_info.physical.depth_unit"
                    inputName="type_specific_info.physical.depth"
                    label="Profundidad"
                    selectOptions={lengthUnitOptions}
                    selectPlaceholder="Unidad"
                    inputPlaceholder="0.00"
                    selectValue={physicalInfo.depth_unit}
                    inputValue={physicalInfo.depth?.toString()}
                    onSelectChange={handleDepthChange}
                    onInputChange={handleDepthInputChange}
                    tooltip="Profundidad del producto"
                    inputType="number"
                    inputMode="decimal"
                    inputPattern="[0-9]*\.?[0-9]*"
                    disabled={disabled}
                />

                <SelectInputField
                    selectName="type_specific_info.physical.diameter_unit"
                    inputName="type_specific_info.physical.diameter"
                    label="Diámetro"
                    selectOptions={lengthUnitOptions}
                    selectPlaceholder="Unidad"
                    inputPlaceholder="0.00"
                    selectValue={physicalInfo.diameter_unit}
                    inputValue={physicalInfo.diameter?.toString()}
                    onSelectChange={handleDiameterChange}
                    onInputChange={handleDiameterInputChange}
                    tooltip="Diámetro del producto (opcional, solo para productos circulares)"
                    inputType="number"
                    inputMode="decimal"
                    inputPattern="[0-9]*\.?[0-9]*"
                    disabled={disabled}
                />
            </div>
        </div>
    )
}
