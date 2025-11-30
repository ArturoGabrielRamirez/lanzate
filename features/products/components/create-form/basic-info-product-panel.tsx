"use client"

import { Box, CloudDownload, Wrench, Link, Tag, ShoppingBag } from "lucide-react"
import { useCallback, useEffect } from "react"
import { Selection } from "react-aria-components"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { TextareaField } from "@/features/global/components/form/textarea-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType, ProductType } from "@/features/products/schemas/create-product-form-schema"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import { ChoiceBox, ChoiceBoxItem, ChoiceBoxLabel, ChoiceBoxDescription } from "@/features/shadcn/components/ui/choice-box"
import { Label } from "@/features/shadcn/components/ui/label"
import { slugify } from "@/features/stores/utils"

export function BasicInfoProductPanel() {

    const { setValue, formState: { isValid, disabled }, trigger } = useFormContext<CreateProductFormType>()
    const { values, setValues, setStepValid } = useCreateProductContext()

    // Sync context with form state on mount
    useEffect(() => {
        trigger(["basic_info.name", "basic_info.slug"])
        setValue("basic_info.name", values.basic_info?.name || "")
        setValue("basic_info.slug", values.basic_info?.slug || "")
        setValue("basic_info.description", values.basic_info?.description || "")
        setValue("basic_info.type", values.basic_info?.type || ProductType.PHYSICAL)
        setValue("basic_info.brand", values.basic_info?.brand || "")
        setValue("basic_info.tags", values.basic_info?.tags || [])
    }, [])

    // Validate step
    useEffect(() => {
        setStepValid(1, isValid)
    }, [isValid, setStepValid])

    const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setValues({ ...values, basic_info: { ...values.basic_info, name, slug: slugify(name) } })
        setValue("basic_info.slug", slugify(name), { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values])

    const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const slug = e.target.value
        setValues({ ...values, basic_info: { ...values.basic_info, slug } })
        setValue("basic_info.slug", slug, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values])

    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const description = e.target.value
        setValues({ ...values, basic_info: { ...values.basic_info, description } })
        setValue("basic_info.description", description, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values])

    const handleTypeChange = useCallback((keys: Selection) => {
        const selected = Array.from(keys)[0] as ProductType
        if (selected) {
            setValues({ ...values, basic_info: { ...values.basic_info, type: selected } })
            setValue("basic_info.type", selected, { shouldValidate: true, shouldDirty: true })
        }
    }, [setValues, setValue, values])

    const handleBrandChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const brand = e.target.value
        setValues({ ...values, basic_info: { ...values.basic_info, brand } })
        setValue("basic_info.brand", brand, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values])

    const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // Simple comma separated tags for now
        const tagsString = e.target.value
        const tags = tagsString.split(',').map(t => t.trim()).filter(Boolean)
        setValues({ ...values, basic_info: { ...values.basic_info, tags } })
        setValue("basic_info.tags", tags, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium">Tipo de Producto</Label>
                <ChoiceBox
                    columns={3}
                    gap={4}
                    selectedKeys={values.basic_info.type ? [values.basic_info.type] : []}
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
                    <ChoiceBoxItem id={ProductType.SERVICE} textValue="Servicio">
                        <Wrench />
                        <ChoiceBoxLabel>Servicio</ChoiceBoxLabel>
                        <ChoiceBoxDescription>Servicio profesional o consultoría.</ChoiceBoxDescription>
                    </ChoiceBoxItem>
                </ChoiceBox>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                    name="basic_info.name"
                    label="Nombre"
                    placeholder="Ej: Camiseta Negra"
                    isRequired
                    onChange={handleNameChange}
                    disabled={disabled}
                    tooltip="El nombre del producto es el nombre que se mostrará en la tienda."
                    startIcon={<Box />}
                />
                <InputField
                    name="basic_info.slug"
                    label="URL (Slug)"
                    placeholder="ej-camiseta-negra"
                    startIcon={<Link />}
                    onChange={handleSlugChange}
                    disabled={disabled}
                    tooltip="El slug es la parte final de la URL de tu producto."
                />
            </div>

            <TextareaField
                name="basic_info.description"
                label="Descripción"
                placeholder="Describe tu producto..."
                onChange={handleDescriptionChange}
                disabled={disabled}
            />

            <Accordion type="single" collapsible>
                <AccordionItem value="advanced" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-4">
                        <span className="text-sm font-medium">Opciones Adicionales</span>
                    </AccordionTrigger>
                    <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                        <InputField
                            name="basic_info.brand"
                            label="Marca"
                            placeholder="Ej: Nike, Adidas..."
                            onChange={handleBrandChange}
                            tooltip="La marca del producto. Ej: Nike, Adidas..."
                            startIcon={<ShoppingBag />}
                            disabled={disabled}
                        />
                        <InputField
                            name="basic_info.tags"
                            label="Etiquetas"
                            placeholder="running, verano, oferta (separadas por coma)"
                            onChange={handleTagsChange}
                            disabled={disabled}
                            tooltip="Palabras clave para ayudar a encontrar tu producto."
                            startIcon={<Tag />}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
