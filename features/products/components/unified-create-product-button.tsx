"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, ShoppingCart, Box, ImageIcon, Boxes, Ruler, Tags, Palette, Settings, DollarSign } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { AccordionTriggerWithValidation } from "@/features/branches/components/accordion-trigger-with-validation"
import { Form } from "@/features/global/components/form/form"
import { formatErrorResponse } from "@/features/global/utils"
import { createUnifiedProductAction } from "@/features/products/actions/create-unified-product.action"
import { BasicInfoSection } from "@/features/products/components/sections/basic-info-section"
import { CategoriesSection } from "@/features/products/components/sections/categories-section"
import { ColorsSection } from "@/features/products/components/sections/colors-section"
import { DimensionsSection } from "@/features/products/components/sections/dimensions-section"
import { MediaSection } from "@/features/products/components/sections/media-section"
import { PriceStockSection } from "@/features/products/components/sections/price-stock-section"
import { SettingsSection } from "@/features/products/components/sections/settings-section"
import { SizesSection } from "@/features/products/components/sections/sizes-section"
import { VariantsEditor } from "@/features/products/components/sections/variants-editor"
import { VariantsPreviewSection } from "@/features/products/components/sections/variants-preview-section"
import { productCreateSchema } from "@/features/products/schemas/product-schema"
import type { CreateUnifiedProductArgs, UnifiedCreateProductButtonProps } from "@/features/products/types"
import type { MediaSectionData, CategoriesSectionData, SizesSectionData, ColorsSectionData, SettingsSectionData, CategoryValue, DimensionsSectionData, ProductColor } from "@/features/products/types"
import { mapUnifiedCreatePayload } from "@/features/products/utils/map-unified-create-payload"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Accordion, AccordionContent, AccordionItem } from "@/features/shadcn/components/ui/accordion"
import { Button } from "@/features/shadcn/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/features/shadcn/components/ui/dialog"
import { Label } from "@/features/shadcn/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { Switch } from "@/features/shadcn/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/lib/utils"


type CreateProductPayload = {
    name: string
    price: number
    stock: number
    description?: string | undefined
    slug?: string | undefined
    sku?: string | undefined
    categories?: CategoryValue[] | undefined
    image?: File | undefined
    is_active?: boolean | undefined
    is_featured?: boolean | undefined
    is_published?: boolean | undefined
}

function UnifiedCreateProductButton(props: UnifiedCreateProductButtonProps) {
    // Local dialog/store selection state
    const [selectedStoreId, setSelectedStoreId] = useState<string>("")
    const [open, setOpen] = useState(false)
    // Section data refs (children own their state; we capture latest snapshot here)
    const mediaRef = useRef<MediaSectionData>({ files: [], primaryIndex: null })
    const categoriesRef = useRef<CategoriesSectionData>({ categories: [] })
    const sizesRef = useRef<SizesSectionData>({ isUniqueSize: false, sizes: [], measures: [] })
    const colorsRef = useRef<ColorsSectionData>({ colors: [] })
    const settingsRef = useRef<SettingsSectionData>({ isActive: true, isFeatured: false, isPublished: true })
    const dimensionsRef = useRef<DimensionsSectionData>({})
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
    const [editingVariant, setEditingVariant] = useState<{ id: string, size?: string, color?: ProductColor } | null>(null)
    const [, setAdvancedChanged] = useState<number>(0)

    const hasStoreId = 'storeId' in props
    const translationNamespace = hasStoreId ? "store.create-product" : "dashboard.create-product"
    const t = useTranslations(translationNamespace)

    // Reset on close
    // Ensure refs are cleared so reopening starts fresh
    useEffect(() => {
        if (!open) {
            mediaRef.current = { files: [], primaryIndex: null }
            categoriesRef.current = { categories: [] }
            sizesRef.current = { isUniqueSize: false, sizes: [], measures: [] }
            colorsRef.current = { colors: [] }
            settingsRef.current = { isActive: true, isFeatured: false, isPublished: true }
            dimensionsRef.current = {}
            setShowAdvanced(false)
            setEditingVariant(null)
            setAdvancedChanged(0)
        }
    }, [open])

    const handleCreateProduct = async (payload: CreateProductPayload) => {
        try {
            // For now only log collected data and return success
            const targetStoreId = hasStoreId ? props.storeId! : (selectedStoreId ? parseInt(selectedStoreId) : undefined)
            if (!targetStoreId) throw new Error(t("messages.select-store-first"))

            // Build variants snapshot (same logic as preview)
            type Option = { label: string; value: string }
            const sizes = (sizesRef.current?.sizes ?? []).map((s: Option) => s.value)
            const measures = (sizesRef.current?.measures ?? []).map((m: Option) => m.value)
            const isUniqueSize = sizesRef.current?.isUniqueSize === true
            const colors = colorsRef.current?.colors ?? []

            let variantsList: { size?: string, measure?: string }[] = []

            if (isUniqueSize) {
                variantsList = [{ size: undefined, measure: undefined }]
            } else {
                if (sizes.length > 0) {
                    variantsList = sizes.map(size => ({ size, measure: undefined }))
                }
                if (measures.length > 0) {
                    variantsList = [...variantsList, ...measures.map(measure => ({ size: undefined, measure }))]
                }
                if (sizes.length === 0 && measures.length === 0) {
                    // Allow color-only variants
                    variantsList = [{ size: undefined, measure: undefined }]
                }
            }

            const colorList: (ProductColor | undefined)[] = (colors?.length ?? 0) > 0 ? colors as ProductColor[] : [undefined]
            const exclusions: string[] = (payload as unknown as { variantExclusions?: string[] }).variantExclusions ?? []

            const variants = variantsList.length === 0 && colorList[0] === undefined
                ? []
                : variantsList.flatMap((variant) => colorList.map((c: ProductColor | undefined) => {
                    const id = `${variant.size ?? variant.measure ?? 'one'}-${c ? c.id : 'one'}`
                    if (exclusions.includes(id)) return null
                    return {
                        id,
                        size: variant.size,
                        measure: variant.measure,
                        color: c ? { id: c.id, name: c.name, rgba: c.rgba } : undefined,
                    }
                })).filter(Boolean)

            const args = mapUnifiedCreatePayload(
                payload as unknown as {
                    name: string
                    slug?: string
                    description?: string
                    price: number
                    stock: number
                    categories: { label: string; value: string }[]
                    images?: File[]
                },
                {
                    media: mediaRef.current,
                    categories: categoriesRef.current,
                    sizes: sizesRef.current,
                    colors: colorsRef.current,
                    dimensions: dimensionsRef.current,
                    settings: settingsRef.current,
                    variants: variants as { id: string; size?: string; measure?: string; color?: ProductColor }[],
                },
                targetStoreId,
                props.userId,
            )

            const { hasError, message, payload: created } = await createUnifiedProductAction(args as CreateUnifiedProductArgs)
            if (hasError) throw new Error(message)
            return { hasError: false, message: t("messages.success"), payload: created }
        } catch (error) {
            return formatErrorResponse(t("messages.error"))
        }
    }

    const handleSuccess = async () => {
        setOpen(false)
    }

    const selectedStore = !hasStoreId && 'stores' in props
        ? props.stores.find(store => store.id.toString() === selectedStoreId)
        : null

    const buttonIcon = hasStoreId ? <Plus /> : <ShoppingCart className="size-4" />
    const buttonClassName = hasStoreId ? undefined : "w-full"
    const resolverConfig = productCreateSchema ? { resolver: yupResolver(productCreateSchema) as unknown as import('react-hook-form').Resolver<CreateProductPayload> } : {}

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {props.onlyIcon ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <IconButton icon={() => buttonIcon} size="md" onClick={() => setOpen(true)} />
                        </TooltipTrigger>
                        <TooltipContent>
                            {t("button")}
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <Button disabled={false} variant="default" type="button" className={cn("w-full", buttonClassName)}>
                        {buttonIcon}
                        <span className="hidden md:block">{t("button")}</span>
                    </Button>)}
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>
                        {t("popup-description")}
                    </DialogDescription>
                </DialogHeader>
                <Form
                    resolver={resolverConfig.resolver}
                    formAction={handleCreateProduct}
                    contentButton={t("button")}
                    successMessage={t("messages.success")}
                    loadingMessage={t("messages.loading")}
                    onSuccess={handleSuccess}
                    disabled={false}
                >
                    <div className="space-y-4">
                        {!hasStoreId && 'stores' in props && (
                            <div className="space-y-2">
                                <Label htmlFor="store-select">{t("select-store")}</Label>
                                <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("choose-store")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.stores.map((store) => (
                                            <SelectItem key={store.id} value={store.id.toString()}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{store.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {store.subdomain}.lanzate.co
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedStore && (
                                    <p className="text-xs text-muted-foreground">
                                        {t("product-will-be-created", { storeName: selectedStore.name })}
                                    </p>
                                )}
                            </div>
                        )}
                        <AnimatePresence initial={false} mode="wait">
                            {!editingVariant ? (
                                <motion.div key="main-content" initial={{ x: 0, opacity: 1 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "-100%", opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
                                    <Accordion type="single" collapsible>

                                        <AccordionItem value="item-1">
                                            <AccordionTriggerWithValidation keys={["name", "slug", "description", "sku", "barcode"]}>
                                                <span className="flex items-center gap-2">
                                                    <Box className="size-4" />
                                                    Informacion básica
                                                </span>
                                            </AccordionTriggerWithValidation>
                                            <AccordionContent className="space-y-4">
                                                <BasicInfoSection />
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-2">
                                            <AccordionTriggerWithValidation keys={["primary-image", "images", "videos"]}>
                                                <span className="flex items-center gap-2">
                                                    <ImageIcon className="size-4" />
                                                    Imagenes y videos
                                                </span>
                                            </AccordionTriggerWithValidation>
                                            <AccordionContent className="space-y-4">
                                                <MediaSection
                                                    value={mediaRef.current}
                                                    onChange={(d) => { mediaRef.current = d }}
                                                    onFileReject={(file, message) => {
                                                        const filename = file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
                                                        toast(message, { description: `"${filename}" has been rejected` })
                                                    }}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-3">
                                            <AccordionTriggerWithValidation keys={["price", "stock"]}>
                                                <span className="flex items-center gap-2">
                                                    <DollarSign className="size-4" />
                                                    Precio y stock
                                                </span>
                                            </AccordionTriggerWithValidation>
                                            <AccordionContent className="space-y-4">
                                                <PriceStockSection />
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-4">
                                            <AccordionTriggerWithValidation keys={["categories"]} completeKeys={["categories"]}>
                                                <span className="flex items-center gap-2">
                                                    <Boxes className="size-4" />
                                                    Categorias
                                                </span>
                                            </AccordionTriggerWithValidation>
                                            <AccordionContent className="space-y-4">
                                                <CategoriesSection
                                                    storeId={hasStoreId ? props.storeId : (selectedStoreId ? parseInt(selectedStoreId) : undefined)}
                                                    onChange={(d) => { categoriesRef.current = d }}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-5">
                                            <AccordionTriggerWithValidation keys={["is-active", "is-featured", "is-published"]}>
                                                <span className="flex items-center gap-2">
                                                    <Settings className="size-4" />
                                                    Configuracion
                                                </span>
                                            </AccordionTriggerWithValidation>
                                            <AccordionContent className="space-y-4">
                                                <SettingsSection onChange={(d) => { settingsRef.current = d }} />
                                            </AccordionContent>
                                        </AccordionItem>

                                    </Accordion>

                                    <div className="flex items-center justify-between rounded-md border p-3">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="advanced-options">Opciones avanzadas</Label>
                                            <p className="text-xs text-muted-foreground">Dimensiones, talles/tamaños y colores</p>
                                        </div>
                                        <Switch id="advanced-options" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
                                    </div>

                                    <AnimatePresence initial={false} mode="wait">
                                        {showAdvanced && (
                                            <motion.div key="advanced-accordion" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
                                                <Accordion type="single" collapsible>
                                                    <AccordionItem value="adv-1">
                                                        <AccordionTriggerWithValidation keys={["weight", "height", "width", "depth", "diameter"]}>
                                                            <span className="flex items-center gap-2">
                                                                <Ruler className="size-4" />
                                                                Dimensiones y peso
                                                            </span>
                                                        </AccordionTriggerWithValidation>
                                                        <AccordionContent className="space-y-4">
                                                            <DimensionsSection onChange={(d) => { dimensionsRef.current = d; setAdvancedChanged((v) => v + 1) }} />
                                                        </AccordionContent>
                                                    </AccordionItem>

                                                    <AccordionItem value="adv-2">
                                                        <AccordionTriggerWithValidation keys={["unique-size", "sizes", "measures"]}>
                                                            <span className="flex items-center gap-2">
                                                                <Tags className="size-4" />
                                                                Talles y tamaños
                                                            </span>
                                                        </AccordionTriggerWithValidation>
                                                        <AccordionContent className="space-y-4">
                                                            <SizesSection onChange={(d) => { sizesRef.current = d; setAdvancedChanged((v) => v + 1) }} />
                                                        </AccordionContent>
                                                    </AccordionItem>

                                                    <AccordionItem value="adv-3">
                                                        <AccordionTriggerWithValidation keys={["colors"]}>
                                                            <span className="flex items-center gap-2">
                                                                <Palette className="size-4" />
                                                                Colores disponibles
                                                            </span>
                                                        </AccordionTriggerWithValidation>
                                                        <AccordionContent className="space-y-4">
                                                            <ColorsSection onChange={(d) => { colorsRef.current = d; setAdvancedChanged((v) => v + 1) }} />
                                                        </AccordionContent>
                                                    </AccordionItem>

                                                    {(() => {
                                                        const dimsUsed = Object.values(dimensionsRef.current).some((v) => v !== undefined && v !== null && v !== "")
                                                        const sizesUsed = (sizesRef.current?.isUniqueSize === true) || (sizesRef.current?.sizes?.length ?? 0) > 0 || (sizesRef.current?.measures?.length ?? 0) > 0
                                                        const colorsUsed = (colorsRef.current?.colors?.length ?? 0) > 0
                                                        const showVariants = (dimsUsed || sizesUsed || colorsUsed)
                                                        return showVariants ? (
                                                            <AccordionItem value="adv-5">
                                                                <AccordionTriggerWithValidation keys={["variants-preview"]}>
                                                                    <span className="flex items-center gap-2">
                                                                        <Boxes className="size-4" />
                                                                        Variantes (vista previa)
                                                                    </span>
                                                                </AccordionTriggerWithValidation>
                                                                <AccordionContent className="space-y-4">
                                                                    <VariantsPreviewSection onEditVariant={(v) => setEditingVariant(v)} />
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ) : null
                                                    })()}
                                                </Accordion>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <motion.div key="editor" initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
                                    <VariantsEditor variant={editingVariant!} onClose={() => setEditingVariant(null)} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export { UnifiedCreateProductButton } 