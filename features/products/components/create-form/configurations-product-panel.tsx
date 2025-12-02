"use client"

import { CheckCircle2, Star, Sparkles, Percent, Ticket, Truck, Search } from "lucide-react"
import { useCallback, useEffect, useMemo } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { SwitchField } from "@/features/global/components/form/switch-field"
import { TextareaField } from "@/features/global/components/form/textarea-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { ProductStatus } from "@/features/products/schemas/create-product-form-schema"
import { Item } from "@/features/shadcn/components/item"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import { Card, CardContent } from "@/features/shadcn/components/ui/card"
import { Switch } from "@/features/shadcn/components/ui/switch"
import { cn } from "@/lib/utils"

interface ConfigurationOptionProps {
    icon: React.ReactNode
    iconBgColor: string
    title: string
    description: string
    name?: string
    checked?: boolean
    defaultValue?: boolean
    onChange?: (checked: boolean) => void
    useCustomSwitch?: boolean
    className?: string
}

function ConfigurationOption({
    icon,
    iconBgColor,
    title,
    description,
    name,
    checked,
    defaultValue,
    onChange,
    useCustomSwitch = false,
    className,
}: ConfigurationOptionProps) {
    return (
        <Item variant="default" className={cn("rounded-none border-border", className)}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center", iconBgColor)}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground mb-0.5">{title}</h3>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="flex-shrink-0">
                {useCustomSwitch ? (
                    <Switch
                        checked={checked ?? defaultValue ?? false}
                        onCheckedChange={onChange}
                    />
                ) : (
                    <SwitchField
                        name={name || ""}
                        label=""
                        defaultValue={defaultValue}
                        onChange={onChange}
                        className="!flex-row-reverse"
                    />
                )}
            </div>
        </Item>
    )
}

export function ConfigurationsProductPanel() {
    const { setValue, formState: { isValid }, trigger, watch } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateProductContext()
    const { settings_info, shipping_info, basic_info } = values

    // Watch form values
    const status = watch("settings_info.status")
    const isFeatured = watch("settings_info.is_featured")
    const isNew = watch("settings_info.is_new")
    const isOnSale = watch("settings_info.is_on_sale")
    const allowPromotions = watch("settings_info.allow_promotions")
    const freeShipping = watch("shipping_info.free_shipping")
    const seoTitle = watch("settings_info.seo_title") || ""
    const seoDescription = watch("settings_info.seo_description") || ""

    useEffect(() => {
        // Initialize form values
        if (settings_info) {
            setValue("settings_info.status", settings_info.status ?? ProductStatus.ACTIVE)
            setValue("settings_info.is_featured", settings_info.is_featured ?? true)
            setValue("settings_info.is_new", settings_info.is_new ?? true)
            setValue("settings_info.is_on_sale", settings_info.is_on_sale ?? false)
            setValue("settings_info.allow_promotions", settings_info.allow_promotions ?? true)
            setValue("settings_info.seo_title", settings_info.seo_title || "")
            setValue("settings_info.seo_description", settings_info.seo_description || "")
        }
        if (shipping_info) {
            setValue("shipping_info.free_shipping", shipping_info.free_shipping ?? false)
        }
        trigger(["settings_info", "shipping_info"])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setStepValid(5, isValid)
    }, [isValid, setStepValid])

    const handleStatusChange = useCallback((checked: boolean) => {
        const newStatus = checked ? ProductStatus.ACTIVE : ProductStatus.DRAFT
        setValue("settings_info.status", newStatus, { shouldValidate: true, shouldDirty: true })
        setCtxValues({
            ...values,
            settings_info: {
                ...(settings_info || {}),
                status: newStatus,
            }
        })
    }, [setValue, setCtxValues, values, settings_info])

    const handleFeaturedChange = useCallback((checked: boolean) => {
        setValue("settings_info.is_featured", checked, { shouldValidate: true, shouldDirty: true })
        setCtxValues({
            ...values,
            settings_info: {
                ...(settings_info || {}),
                is_featured: checked,
            }
        })
    }, [setValue, setCtxValues, values, settings_info])

    const handleNewChange = useCallback((checked: boolean) => {
        setValue("settings_info.is_new", checked, { shouldValidate: true, shouldDirty: true })
        setCtxValues({
            ...values,
            settings_info: {
                ...(settings_info || {}),
                is_new: checked,
            }
        })
    }, [setValue, setCtxValues, values, settings_info])

    const handleOnSaleChange = useCallback((checked: boolean) => {
        setValue("settings_info.is_on_sale", checked, { shouldValidate: true, shouldDirty: true })
        setCtxValues({
            ...values,
            settings_info: {
                ...(settings_info || {}),
                is_on_sale: checked,
            }
        })
    }, [setValue, setCtxValues, values, settings_info])

    const handleAllowPromotionsChange = useCallback((checked: boolean) => {
        setValue("settings_info.allow_promotions", checked, { shouldValidate: true, shouldDirty: true })
        setCtxValues({
            ...values,
            settings_info: {
                ...(settings_info || {}),
                allow_promotions: checked,
            }
        })
    }, [setValue, setCtxValues, values, settings_info])

    const handleFreeShippingChange = useCallback((checked: boolean) => {
        setValue("shipping_info.free_shipping", checked, { shouldValidate: true, shouldDirty: true })
        setCtxValues({
            ...values,
            shipping_info: {
                ...(shipping_info || {}),
                free_shipping: checked,
            }
        })
    }, [setValue, setCtxValues, values, shipping_info])

    const handleSeoTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setValue("settings_info.seo_title", value, { shouldValidate: true, shouldDirty: true })
        setCtxValues({
            ...values,
            settings_info: {
                ...(settings_info || {}),
                seo_title: value,
            }
        })
    }, [setValue, setCtxValues, values, settings_info])

    const handleSeoDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        setValue("settings_info.seo_description", value, { shouldValidate: true, shouldDirty: true })
        setCtxValues({
            ...values,
            settings_info: {
                ...(settings_info || {}),
                seo_description: value,
            }
        })
    }, [setValue, setCtxValues, values, settings_info])

    // Generate preview URL
    const previewUrl = useMemo(() => {
        const slug = basic_info?.slug || basic_info?.name?.toLowerCase().replace(/\s+/g, "-") || "producto"
        return `tu-tienda.lanzate.com > productos > ${slug.substring(0, 1)}`
    }, [basic_info?.slug, basic_info?.name])

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-md border border-border">
                <ConfigurationOption
                    icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
                    iconBgColor="bg-green-100 dark:bg-green-900/30"
                    title="Producto activo"
                    description="Visible en la tienda"
                    checked={status === ProductStatus.ACTIVE}
                    onChange={handleStatusChange}
                    useCustomSwitch={true}
                    className="rounded-tl-md border-0 border-b md:border-r md:border-b"
                />
                <ConfigurationOption
                    icon={<Star className="w-5 h-5 text-orange-600" />}
                    iconBgColor="bg-orange-100 dark:bg-orange-900/30"
                    title="Destacado"
                    description="Mostrar en sección principal"
                    name="settings_info.is_featured"
                    defaultValue={isFeatured}
                    onChange={handleFeaturedChange}
                    className="rounded-tr-md border-0 border-b md:border-b"
                />
                <ConfigurationOption
                    icon={<Sparkles className="w-5 h-5 text-blue-600" />}
                    iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                    title="Producto nuevo"
                    description='Mostrar badge "Nuevo"'
                    name="settings_info.is_new"
                    defaultValue={isNew}
                    onChange={handleNewChange}
                    className="border-0 border-b md:border-r md:border-b"
                />
                <ConfigurationOption
                    icon={<Percent className="w-5 h-5 text-red-600" />}
                    iconBgColor="bg-red-100 dark:bg-red-900/30"
                    title="En oferta"
                    description="Mostrar badge de descuento"
                    name="settings_info.is_on_sale"
                    defaultValue={isOnSale}
                    onChange={handleOnSaleChange}
                    className="border-0 border-b md:border-b"
                />
                <ConfigurationOption
                    icon={<Ticket className="w-5 h-5 text-purple-600" />}
                    iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                    title="Permitir cupones"
                    description="Admite ofertas futuras"
                    name="settings_info.allow_promotions"
                    defaultValue={allowPromotions}
                    onChange={handleAllowPromotionsChange}
                    className="rounded-bl-md border-0 border-b md:border-r md:border-b-0"
                />
                <ConfigurationOption
                    icon={<Truck className="w-5 h-5 text-teal-600" />}
                    iconBgColor="bg-teal-100 dark:bg-teal-900/30"
                    title="Envío gratuito"
                    description="Ofrecer envío sin costo"
                    name="shipping_info.free_shipping"
                    defaultValue={freeShipping}
                    onChange={handleFreeShippingChange}
                    className="rounded-br-md border-0"
                />
            </div>

            {/* SEO Section */}
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="seo" className="border-none">
                    <AccordionTrigger className="hover:no-underline">
                        <span className="flex items-center gap-2">
                            <Search className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm font-semibold">Optimización para buscadores (SEO)</span>
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <InputField
                            name="settings_info.seo_title"
                            label="Título SEO"
                            placeholder="Título SEO"
                            tooltip="El título SEO aparecerá en los resultados de búsqueda."
                            maxLength={60}
                            onChange={handleSeoTitleChange}
                        />

                        <TextareaField
                            name="settings_info.seo_description"
                            label="Meta descripción"
                            placeholder="Meta descripción"
                            tooltip="La descripción aparecerá debajo del título en los resultados de búsqueda."
                            maxLength={160}
                            onChange={handleSeoDescriptionChange}
                        />

                        {/* Google Preview */}
                        <div className="flex flex-col gap-2">
                            <h4 className="text-sm font-medium">Vista previa en Google</h4>
                            <Card className="border border-border">
                                <CardContent>
                                    <div className="flex flex-col gap-1">
                                        <a
                                            href="#"
                                            className="text-lg text-blue-600 hover:underline line-clamp-1"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            {seoTitle || basic_info?.name || "Sin título"}
                                        </a>
                                        <p className="text-sm text-green-700 line-clamp-1">
                                            {previewUrl}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {seoDescription || "Sin descripción"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

