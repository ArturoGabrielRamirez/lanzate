"use client"

// import { createProduct } from "../actions/createProduct"
import { productCreateSchema } from "../schemas/product-schema"
import { formatErrorResponse } from "@/utils/lib"
import { Plus, ShoppingCart, Box, ImageIcon, Boxes, Ruler, Tags, Palette, Settings, DollarSign } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTranslations } from "next-intl"
import { UnifiedCreateProductButtonProps } from "../type"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form } from "@/features/layout/components"
import { cn } from "@/lib/utils"
import { yupResolver } from "@hookform/resolvers/yup"
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import AccordionTriggerWithValidation from "@/features/branches/components/accordion-trigger-with-validation"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import BasicInfoSection from "./sections/basic-info-section"
import MediaSection from "./sections/media-section"
import PriceStockSection from "./sections/price-stock-section"
import CategoriesSection from "./sections/categories-section"
import SizesSection from "./sections/sizes-section"
import SettingsSection from "./sections/settings-section"
import ColorsSection from "./sections/colors-section"
import DimensionsSection from "./sections/dimensions-section"
import VariantsPreviewSection from "./sections/variants-preview-section"
import type { MediaSectionData, CategoriesSectionData, SizesSectionData, ColorsSectionData, SettingsSectionData, CategoryValue, DimensionsSectionData } from "../type/create-form-extra"
import type { ProductColor } from "../type/product-color"

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
    const [, setAdvancedChanged] = useState<number>(0)

    const hasStoreId = 'storeId' in props
    const translationNamespace = hasStoreId ? "store.create-product" : "dashboard.create-product"
    const t = useTranslations(translationNamespace)

    // Reset on close
    // No need to reset child state; they unmount when dialog closes

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
            const dimensionList: (string | undefined)[] = isUniqueSize
                ? [undefined]
                : ((sizes.length > 0 && measures.length > 0)
                    ? [...sizes, ...measures]
                    : (sizes.length > 0 ? sizes : measures))
            const colorList: (ProductColor | undefined)[] = (colors?.length ?? 0) > 0 ? colors as ProductColor[] : [undefined]
            const exclusions: string[] = (payload as unknown as { variantExclusions?: string[] }).variantExclusions ?? []
            const variants = dimensionList.length === 0 && colorList[0] === undefined
                ? []
                : dimensionList.flatMap((dim) => colorList.map((c: ProductColor | undefined) => {
                    const id = `${dim ?? 'one'}-${c ? c.id : 'one'}`
                    if (exclusions.includes(id)) return null
                    return {
                        id,
                        sizeOrMeasure: dim,
                        color: c ? { id: c.id, name: c.name, rgba: c.rgba } : undefined,
                    }
                })).filter(Boolean)

            const collected = {
                form: payload,
                media: mediaRef.current,
                categories: categoriesRef.current,
                sizes: sizesRef.current,
                colors: colorsRef.current,
                dimensions: dimensionsRef.current,
                settings: settingsRef.current,
                variants,
                targetStoreId,
                userId: props.userId,
            }
            console.log("Create Product (preview only):", collected)

            // --- Real creation commented for now ---
            /*
            const { error, message, payload: product } = await createProduct({
                ...payload,
                categories: categoriesRef.current.categories,
                image: mediaRef.current.files[0],
                is_active: settingsRef.current.isActive,
                is_featured: settingsRef.current.isFeatured,
                is_published: settingsRef.current.isPublished,
            }, targetStoreId, props.userId)
            if (error) throw new Error(message)
            */

            return { error: false, message: t("messages.success"), payload: null }
        } catch (error) {
            return formatErrorResponse(t("messages.error"), error, null)
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

                        <Accordion type="single" collapsible>
                            {showAdvanced && (
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
                            )}

                            {showAdvanced && (
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
                            )}

                            {showAdvanced && (
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
                            )}

                            

                            {(() => {
                                const dimsUsed = Object.values(dimensionsRef.current).some((v) => v !== undefined && v !== null && v !== "")
                                const sizesUsed = (sizesRef.current?.isUniqueSize === true) || (sizesRef.current?.sizes?.length ?? 0) > 0 || (sizesRef.current?.measures?.length ?? 0) > 0
                                const colorsUsed = (colorsRef.current?.colors?.length ?? 0) > 0
                                const showVariants = showAdvanced && (dimsUsed || sizesUsed || colorsUsed)
                                return showVariants ? (
                            <AccordionItem value="adv-5">
                                <AccordionTriggerWithValidation keys={["variants-preview"]}>
                                    <span className="flex items-center gap-2">
                                        <Boxes className="size-4" />
                                        Variantes (vista previa)
                                    </span>
                                </AccordionTriggerWithValidation>
                                <AccordionContent className="space-y-4">
                                    <VariantsPreviewSection />
                                </AccordionContent>
                            </AccordionItem>
                                ) : null
                            })()}
                        </Accordion>

                    </div>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default UnifiedCreateProductButton 